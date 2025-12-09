{
	"info": {
		"_postman_id": "b3f3e849-5b23-45c1-8b2a-123456789abc",
		"name": "GUPJOB API Gateway Tests",
		"description": "Collection to test the API Gateway forwarding to Auth Service.",
		"schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
	},
	"item": [
		{
			"name": "1. Gateway Health Check",
			"request": {
				"method": "GET",
				"header": [],
				"url": {
					"raw": "{{gatewayUrl}}/",
					"host": [
						"{{gatewayUrl}}"
					],
					"path": [
						""
					]
				},
				"description": "Tests if the Gateway is running on port 8080. Should return 'GUPJOB API Gateway is running'."
			},
			"response": []
		},
		{
			"name": "2. Register (Public)",
			"request": {
				"method": "POST",
				"header": [
					{
						"key": "Content-Type",
						"value": "application/json"
					}
				],
				"body": {
					"mode": "raw",
					"raw": "{\n    \"email\": \"newuser@example.com\",\n    \"password\": \"password123\",\n    \"name\": \"New Learner\",\n    \"role\": \"LEARNER\"\n}"
				},
				"url": {
					"raw": "{{gatewayUrl}}/api/auth/register",
					"host": [
						"{{gatewayUrl}}"
					],
					"path": [
						"api",
						"auth",
						"register"
					]
				},
				"description": "Sends request to Gateway -> Forwards to Auth Service /auth/register"
			},
			"response": []
		},
		{
			"name": "3. Login (Public & Set Token)",
			"event": [
				{
					"listen": "test",
					"script": {
						"exec": [
							"var jsonData = pm.response.json();",
							"// Automatically save the token to environment variables",
							"if (jsonData.access_token) {",
							"    pm.environment.set(\"accessToken\", jsonData.access_token);",
							"    console.log(\"Access Token saved to environment\");",
							"}"
						],
						"type": "text/javascript"
					}
				}
			],
			"request": {
				"method": "POST",
				"header": [
					{
						"key": "Content-Type",
						"value": "application/json"
					}
				],
				"body": {
					"mode": "raw",
					"raw": "{\n    \"email\": \"newuser@example.com\",\n    \"password\": \"password123\"\n}"
				},
				"url": {
					"raw": "{{gatewayUrl}}/api/auth/login",
					"host": [
						"{{gatewayUrl}}"
					],
					"path": [
						"api",
						"auth",
						"login"
					]
				},
				"description": "Gateway should allow this PUBLIC request. Backend sets HttpOnly cookie."
			},
			"response": []
		},
		{
			"name": "4. Refresh Token (Cookie Check)",
			"request": {
				"method": "POST",
				"header": [],
				"body": {
					"mode": "raw",
					"raw": ""
				},
				"url": {
					"raw": "{{gatewayUrl}}/api/auth/refresh",
					"host": [
						"{{gatewayUrl}}"
					],
					"path": [
						"api",
						"auth",
						"refresh"
					]
				},
				"description": "Tests if the Gateway passes the HttpOnly cookie correctly to the backend."
			},
			"response": []
		},
		{
			"name": "5. Protected Route (Test Gateway Auth)",
			"request": {
				"method": "GET",
				"header": [
					{
						"key": "Authorization",
						"value": "Bearer {{accessToken}}",
						"type": "text"
					}
				],
				"url": {
					"raw": "{{gatewayUrl}}/api/user/profile",
					"host": [
						"{{gatewayUrl}}"
					],
					"path": [
						"api",
						"user",
						"profile"
					]
				},
				"description": "If Gateway works, it verifies the JWT and forwards. If Auth fails, Gateway returns 401."
			},
			"response": []
		},
		{
			"name": "6. Logout (Requires Token)",
			"request": {
				"method": "POST",
				"header": [],
				"url": {
					"raw": "{{gatewayUrl}}/api/auth/logout",
					"host": [
						"{{gatewayUrl}}"
					],
					"path": [
						"api",
						"auth",
						"logout"
					]
				},
				"auth": {
					"type": "bearer",
					"bearer": [
						{
							"key": "token",
							"value": "{{accessToken}}",
							"type": "string"
						}
					]
				},
				"description": "Sends Access Token to identify user, revokes refresh tokens in DB, and clears cookie."
			},
			"response": []
		}
	],
	"variable": [
		{
			"key": "gatewayUrl",
			"value": "http://localhost:8080"
		}
	]
}