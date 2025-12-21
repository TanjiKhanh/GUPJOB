# 🔐 Forgot Password & Reset Password - Code Review

## 📋 File Liên Quan

### Frontend
- **[ForgotPassword.tsx](../../frontend/src/pages/public/ForgotPassword.tsx)** - Giao diện và logic xử lý
- **[App.tsx](../../frontend/src/App.tsx)** - Routes định nghĩa

### Backend
- **[auth.controller.ts](../../services/auth/src/controllers/auth.controller.ts)** - API endpoints
- **[auth.service.ts](../../services/auth/src/services/auth.service.ts)** - Business logic
- **[forgot-password.dto.ts](../../services/auth/src/dto/forgot-password.dto.ts)** - Data validation
- **[auth.middleware.ts](../../services/api-gateway/src/common/middlewares/auth.middleware.ts)** - Public routes config

---

## ✅ Checks Thực Hiện

### 1. **Frontend Issues** ✓ FIXED

#### Problem
```tsx
// ❌ WRONG: Using port 3000
await axios.post('http://localhost:3000/auth/forgot-password', { email });
await axios.post('http://localhost:3000/auth/reset-password', { token, newPassword });
```

#### Solution
```tsx
// ✅ CORRECT: Using API Gateway port 3005
await axios.post('http://localhost:3005/auth/forgot-password', { email });
await axios.post('http://localhost:3005/auth/reset-password', { token, newPassword });
```

**Status**: ✅ Fixed in ForgotPassword.tsx (lines 27 & 51)

---

### 2. **Backend Controller Decorators** ✓ FIXED

#### Problem
```typescript
// ❌ Missing HttpCode decorator
@Post('forgot-password')
async forgotPassword(@Body() dto: ForgotPasswordDto) {
  return this.authService.forgotPassword(dto);
}

@Post('reset-password')
async resetPassword(@Body() dto: ResetPasswordDto) {
  return this.authService.resetPassword(dto);
}
```

#### Solution
```typescript
// ✅ Added HttpCode decorator
@Post('forgot-password')
@HttpCode(HttpStatus.OK)
async forgotPassword(@Body() dto: ForgotPasswordDto) {
  return this.authService.forgotPassword(dto);
}

@Post('reset-password')
@HttpCode(HttpStatus.OK)
async resetPassword(@Body() dto: ResetPasswordDto) {
  return this.authService.resetPassword(dto);
}
```

**Status**: ✅ Fixed in auth.controller.ts (lines 121-128)

---

### 3. **Auth Middleware - Public Routes** ✓ VERIFIED

#### Code
```typescript
// ✅ CORRECT: Routes already in publicRoutes
const publicRoutes = ['/auth/login', '/auth/register' ,'/auth/refresh-token', '/auth/reset-password', '/auth/forgot-password'];
if (publicRoutes.some(route => req.originalUrl.startsWith(route))) {
  return next();
}
```

**Status**: ✅ Already configured correctly in auth.middleware.ts (line 17)

---

### 4. **Service Implementation** ✓ VERIFIED

#### forgotPassword Method
```typescript
async forgotPassword(dto: ForgotPasswordDto) {
  const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
  if (!user) throw new NotFoundException('Email không tồn tại trong hệ thống.');

  // Create 6-digit token
  const token = Math.floor(100000 + Math.random() * 900000).toString();

  // Save to DB with 15-minute expiry
  await this.prisma.user.update({
    where: { email: dto.email },
    data: {
      resetPasswordToken: token,
      resetPasswordExpires: new Date(Date.now() + 15 * 60 * 1000),
    },
  });

  // Send email with token
  await this.mailerService.sendMail({
    to: dto.email,
    subject: '[GupJob] Reset Your Password',
    html: `<div style="...">...</div>`,
  });

  return { message: 'The verification code has been sent to your email.' };
}
```

**Status**: ✅ Implementation looks correct

#### resetPassword Method
```typescript
async resetPassword(dto: ResetPasswordDto) {
  // Verify token exists and not expired
  const user = await this.prisma.user.findFirst({
    where: {
      resetPasswordToken: dto.token,
      resetPasswordExpires: { gt: new Date() }, // Not expired
    },
  });

  if (!user) {
    throw new BadRequestException('The verification code is invalid or has expired.');
  }

  // Hash and update password
  const hashedPassword = await bcrypt.hash(dto.newPassword, 10);

  await this.prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    },
  });

  return { success: true, message: 'Password has been updated successfully.' };
}
```

**Status**: ✅ Implementation looks correct

---

### 5. **DTOs & Validation** ✓ VERIFIED

```typescript
export class ForgotPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class ResetPasswordDto {
  @IsNotEmpty()
  token: string;

  @IsNotEmpty()
  @MinLength(8)
  newPassword: string;
}
```

**Status**: ✅ Correct validation rules

---

### 6. **Frontend Routes** ✓ VERIFIED

```typescript
<Route 
  path="/forgot-password" 
  element={<PublicOnly><ForgotPassword /></PublicOnly>} 
/>
```

**Status**: ✅ Route configured correctly

---

### 7. **Login Page Link** ✓ VERIFIED

```tsx
<Link to="/forgot-password" className="link-muted">
  Forgot password?
</Link>
```

**Status**: ✅ Link points to correct route

---

## 🧪 How to Test

### Option 1: Using cURL/PowerShell

```powershell
# Step 1: Request password reset
$body = @{email="user@example.com"} | ConvertTo-Json
Invoke-WebRequest -Uri "http://localhost:3005/auth/forgot-password" `
  -Method POST -Body $body -ContentType "application/json"

# Step 2: Get the token from email (in real scenario)
# For testing, check database: SELECT resetPasswordToken FROM "User" WHERE email='user@example.com'

# Step 3: Reset password with token
$resetBody = @{token="123456"; newPassword="NewPassword123"} | ConvertTo-Json
Invoke-WebRequest -Uri "http://localhost:3005/auth/reset-password" `
  -Method POST -Body $resetBody -ContentType "application/json"
```

### Option 2: Using Postman

1. Create new POST request: `http://localhost:3005/auth/forgot-password`
2. Body (JSON):
   ```json
   {
     "email": "user@example.com"
   }
   ```
3. Click Send - should return 200 with message

---

## ⚠️ Prerequisites

Before testing, ensure:

1. ✅ All services running:
   - Auth Service: `http://localhost:3001`
   - API Gateway: `http://localhost:3005`
   - Database: Connected and migrated

2. ✅ User exists with test email (or create via `/auth/register`)

3. ✅ Email service configured (nodemailer):
   - Check `.env` file for SMTP credentials
   - Or set `NODE_ENV=development` for console logging

4. ✅ Database schema has these fields:
   - `resetPasswordToken: String` (nullable)
   - `resetPasswordExpires: DateTime` (nullable)

---

## 📝 Summary

| Item | Status | Notes |
|------|--------|-------|
| Frontend URLs | ✅ Fixed | Changed from 3000 to 3005 |
| Controller Decorators | ✅ Fixed | Added @HttpCode(HttpStatus.OK) |
| Middleware Config | ✅ OK | Routes already in publicRoutes |
| Service Logic | ✅ OK | forgotPassword & resetPassword implemented |
| Routes | ✅ OK | /forgot-password route configured |
| DTOs | ✅ OK | Proper validation |
| Email Service | ⚠️ Check | Verify nodemailer setup in auth service |

---

## 🔗 Related Links

- Test file: [forgot-password.test.ts](../../tests/forgot-password.test.ts)
- API Gateway: [api-gateway/src/app.module.ts](../../services/api-gateway/src/app.module.ts)
- Prisma Schema: [auth/prisma/schema.prisma](../../services/auth/prisma/schema.prisma)
