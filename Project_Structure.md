
```
GUPJOB
├─ GUPJOB
│  ├─ docs
│  │  ├─ adrs
│  │  │  └─ 0001-monolith-vs-microservices.md
│  │  ├─ api-design.md
│  │  └─ architecture.md
│  ├─ FIXES_APPLIED.md
│  ├─ frontend
│  │  ├─ FRONTEND_STRUCTURE.md
│  │  ├─ index.html
│  │  ├─ package-lock.json
│  │  ├─ package.json
│  │  ├─ src
│  │  │  ├─ api
│  │  │  │  └─ axios.ts
│  │  │  ├─ App.tsx
│  │  │  ├─ assets
│  │  │  │  └─ images
│  │  │  │     ├─ icon-cohort-tracking.png
│  │  │  │     ├─ icon-data-driven-hiring.png
│  │  │  │     ├─ icon-expert-mentorship.png
│  │  │  │     ├─ icon-interactive-roadmaps.png
│  │  │  │     ├─ icon-real-projects.png
│  │  │  │     ├─ icon-verified-skills.png
│  │  │  │     ├─ img-landing-hero.png
│  │  │  │     └─ logo-gupjob-primary.png
│  │  │  ├─ auth
│  │  │  │  ├─ AuthProvider.tsx
│  │  │  │  ├─ PublicOnly.tsx
│  │  │  │  ├─ RequireAuth.tsx
│  │  │  │  └─ tokenStore.tsx
│  │  │  ├─ components
│  │  │  │  ├─ Footer.tsx
│  │  │  │  ├─ Header.tsx
│  │  │  │  └─ Sidebar.tsx
│  │  │  ├─ layouts
│  │  │  │  └─ MainLayout.tsx
│  │  │  ├─ main.tsx
│  │  │  ├─ pages
│  │  │  │  ├─ Dashboard.tsx
│  │  │  │  ├─ Landing.tsx
│  │  │  │  ├─ learner
│  │  │  │  │  └─ LearnerDashboard.tsx
│  │  │  │  ├─ Login.tsx
│  │  │  │  ├─ mentor
│  │  │  │  │  └─ MentorDashboard.tsx
│  │  │  │  └─ Register.tsx
│  │  │  ├─ styles
│  │  │  │  ├─ auth.css
│  │  │  │  ├─ dashboard.css
│  │  │  │  └─ styles.css
│  │  │  └─ types
│  │  │     └─ images.d.ts
│  │  ├─ tsconfig.json
│  │  └─ vite.config.ts
│  ├─ infra
│  │  ├─ docker
│  │  │  └─ hello.Dockerfile
│  │  └─ docker-compose.yml
│  ├─ LOCAL_DEV_SETUP.md
│  ├─ packages
│  │  ├─ contracts
│  │  │  └─ package.json
│  │  └─ shared
│  │     └─ package.json
│  ├─ QUICK_START.md
│  ├─ README.md
│  ├─ scripts
│  │  ├─ bootstrap.sh
│  │  ├─ dev-start.sh
│  │  ├─ seed
│  │  │  └─ seed-users.ts
│  │  ├─ setup-local.bat
│  │  └─ setup-local.sh
│  ├─ services
│  │  ├─ api-gateway
│  │  │  ├─ .env
│  │  │  ├─ Dockerfile
│  │  │  ├─ index.js
│  │  │  ├─ package-lock.json
│  │  │  ├─ package.json
│  │  │  ├─ src
│  │  │  │  └─ main.ts
│  │  │  └─ tsconfig.json
│  │  ├─ auth
│  │  │  ├─ .env
│  │  │  ├─ app.module.ts
│  │  │  ├─ dist
│  │  │  │  ├─ app.module.d.ts
│  │  │  │  ├─ app.module.js
│  │  │  │  ├─ app.module.js.map
│  │  │  │  ├─ main.d.ts
│  │  │  │  ├─ main.js
│  │  │  │  ├─ main.js.map
│  │  │  │  ├─ src
│  │  │  │  │  ├─ controllers
│  │  │  │  │  │  ├─ auth.controller.d.ts
│  │  │  │  │  │  ├─ auth.controller.js
│  │  │  │  │  │  └─ auth.controller.js.map
│  │  │  │  │  ├─ dto
│  │  │  │  │  │  ├─ login.dto.d.ts
│  │  │  │  │  │  ├─ login.dto.js
│  │  │  │  │  │  ├─ login.dto.js.map
│  │  │  │  │  │  ├─ register.dto.d.ts
│  │  │  │  │  │  ├─ register.dto.js
│  │  │  │  │  │  └─ register.dto.js.map
│  │  │  │  │  ├─ prisma
│  │  │  │  │  │  ├─ prisma.service.d.ts
│  │  │  │  │  │  ├─ prisma.service.js
│  │  │  │  │  │  └─ prisma.service.js.map
│  │  │  │  │  ├─ repositories
│  │  │  │  │  │  ├─ user.repository.d.ts
│  │  │  │  │  │  ├─ user.repository.js
│  │  │  │  │  │  └─ user.repository.js.map
│  │  │  │  │  └─ services
│  │  │  │  │     ├─ auth.service.d.ts
│  │  │  │  │     ├─ auth.service.js
│  │  │  │  │     ├─ auth.service.js.map
│  │  │  │  │     ├─ users.service.d.ts
│  │  │  │  │     ├─ users.service.js
│  │  │  │  │     └─ users.service.js.map
│  │  │  │  └─ tsconfig.tsbuildinfo
│  │  │  ├─ Dockerfile
│  │  │  ├─ main.ts
│  │  │  ├─ package-lock.json
│  │  │  ├─ package.json
│  │  │  ├─ prisma
│  │  │  │  └─ schema.prisma
│  │  │  ├─ src
│  │  │  │  ├─ controllers
│  │  │  │  │  └─ auth.controller.ts
│  │  │  │  ├─ dto
│  │  │  │  │  ├─ login.dto.ts
│  │  │  │  │  └─ register.dto.ts
│  │  │  │  ├─ filter
│  │  │  │  │  ├─ all-exceptions.filter.ts
│  │  │  │  │  ├─ prisma-exception.filter.ts
│  │  │  │  │  └─ response.interceptor.ts
│  │  │  │  ├─ guards
│  │  │  │  │  └─ jwt.guard.ts
│  │  │  │  ├─ prisma
│  │  │  │  │  └─ prisma.service.ts
│  │  │  │  ├─ repositories
│  │  │  │  │  └─ user.repository.ts
│  │  │  │  ├─ services
│  │  │  │  │  ├─ auth.service.ts
│  │  │  │  │  └─ users.service.ts
│  │  │  │  └─ strategies
│  │  │  │     └─ jwt.strategy.ts
│  │  │  └─ tsconfig.json
│  │  ├─ mentor-service
│  │  │  ├─ Dockerfile
│  │  │  ├─ package.json
│  │  │  ├─ src
│  │  │  │  └─ main.ts
│  │  │  └─ tsconfig.json
│  │  ├─ mentorship-service
│  │  │  ├─ Dockerfile
│  │  │  ├─ package.json
│  │  │  ├─ src
│  │  │  │  └─ main.ts
│  │  │  └─ tsconfig.json
│  │  ├─ notification-service
│  │  │  ├─ Dockerfile
│  │  │  ├─ package.json
│  │  │  ├─ src
│  │  │  │  └─ main.ts
│  │  │  └─ tsconfig.json
│  │  ├─ user-service
│  │  │  ├─ Dockerfile
│  │  │  ├─ package.json
│  │  │  ├─ src
│  │  │  │  ├─ controllers
│  │  │  │  │  └─ users.controller.ts
│  │  │  │  └─ main.ts
│  │  │  └─ tsconfig.json
│  │  └─ verification-service
│  │     ├─ Dockerfile
│  │     ├─ package.json
│  │     ├─ src
│  │     │  └─ main.ts
│  │     └─ tsconfig.json
│  └─ tests
│     └─ contract-tests
│        └─ api_auth_test.js
└─ services
   └─ auth
      └─ main.ts

```