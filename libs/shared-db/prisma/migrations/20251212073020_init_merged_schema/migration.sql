-- CreateEnum
CREATE TYPE "Role" AS ENUM ('STUDENT', 'MENTOR', 'ADMIN', 'COMPANY');

-- CreateEnum
CREATE TYPE "CourseType" AS ENUM ('BASIC', 'JOB');

-- CreateEnum
CREATE TYPE "RoadmapNodeStatus" AS ENUM ('LOCKED', 'AVAILABLE', 'IN_PROGRESS', 'COMPLETED', 'VERIFIED');

-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "role" "Role" NOT NULL DEFAULT 'STUDENT',
    "departmentId" INTEGER,
    "rating" DOUBLE PRECISION DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RefreshToken" (
    "id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revoked" BOOLEAN NOT NULL DEFAULT false,
    "userAgent" TEXT,
    "ip" TEXT,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Department" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" "CourseType" NOT NULL,
    "departmentId" INTEGER,
    "structure" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Roadmap" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "structure" JSONB,
    "courseId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Roadmap_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoadmapNode" (
    "id" SERIAL NOT NULL,
    "roadmapId" INTEGER NOT NULL,
    "nodeKey" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT,
    "contentMd" TEXT,
    "isRequired" BOOLEAN NOT NULL DEFAULT true,
    "metadata" JSONB,
    "coords" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RoadmapNode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoadmapEdge" (
    "id" SERIAL NOT NULL,
    "roadmapId" INTEGER NOT NULL,
    "sourceKey" TEXT NOT NULL,
    "targetKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RoadmapEdge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserRoadmap" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "roadmapId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT,
    "structure" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserRoadmap_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserRoadmapNode" (
    "id" SERIAL NOT NULL,
    "userRoadmapId" INTEGER NOT NULL,
    "nodeKey" TEXT NOT NULL,
    "title" TEXT,
    "status" "RoadmapNodeStatus" NOT NULL DEFAULT 'AVAILABLE',
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "verifiedAt" TIMESTAMP(3),
    "verifierId" INTEGER,
    "positionOverride" JSONB,
    "userNotesMd" TEXT,
    "verificationRequired" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserRoadmapNode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationSubmission" (
    "id" SERIAL NOT NULL,
    "userRoadmapNodeId" INTEGER NOT NULL,
    "submitterId" INTEGER NOT NULL,
    "description" TEXT,
    "evidence" JSONB,
    "status" "SubmissionStatus" NOT NULL DEFAULT 'PENDING',
    "reviewerId" INTEGER,
    "reviewerComment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),

    CONSTRAINT "VerificationSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "RefreshToken_userId_idx" ON "RefreshToken"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Department_name_key" ON "Department"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Course_slug_key" ON "Course"("slug");

-- CreateIndex
CREATE INDEX "Course_departmentId_idx" ON "Course"("departmentId");

-- CreateIndex
CREATE UNIQUE INDEX "Roadmap_slug_key" ON "Roadmap"("slug");

-- CreateIndex
CREATE INDEX "Roadmap_courseId_idx" ON "Roadmap"("courseId");

-- CreateIndex
CREATE INDEX "RoadmapNode_roadmapId_idx" ON "RoadmapNode"("roadmapId");

-- CreateIndex
CREATE UNIQUE INDEX "RoadmapNode_roadmapId_nodeKey_key" ON "RoadmapNode"("roadmapId", "nodeKey");

-- CreateIndex
CREATE INDEX "RoadmapEdge_roadmapId_sourceKey_idx" ON "RoadmapEdge"("roadmapId", "sourceKey");

-- CreateIndex
CREATE INDEX "RoadmapEdge_roadmapId_targetKey_idx" ON "RoadmapEdge"("roadmapId", "targetKey");

-- CreateIndex
CREATE INDEX "UserRoadmap_userId_idx" ON "UserRoadmap"("userId");

-- CreateIndex
CREATE INDEX "UserRoadmap_roadmapId_idx" ON "UserRoadmap"("roadmapId");

-- CreateIndex
CREATE UNIQUE INDEX "UserRoadmap_userId_roadmapId_key" ON "UserRoadmap"("userId", "roadmapId");

-- CreateIndex
CREATE INDEX "UserRoadmapNode_userRoadmapId_idx" ON "UserRoadmapNode"("userRoadmapId");

-- CreateIndex
CREATE INDEX "UserRoadmapNode_verifierId_idx" ON "UserRoadmapNode"("verifierId");

-- CreateIndex
CREATE INDEX "UserRoadmapNode_status_idx" ON "UserRoadmapNode"("status");

-- CreateIndex
CREATE UNIQUE INDEX "UserRoadmapNode_userRoadmapId_nodeKey_key" ON "UserRoadmapNode"("userRoadmapId", "nodeKey");

-- CreateIndex
CREATE INDEX "VerificationSubmission_status_idx" ON "VerificationSubmission"("status");

-- CreateIndex
CREATE INDEX "VerificationSubmission_submitterId_idx" ON "VerificationSubmission"("submitterId");

-- CreateIndex
CREATE INDEX "VerificationSubmission_reviewerId_idx" ON "VerificationSubmission"("reviewerId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Roadmap" ADD CONSTRAINT "Roadmap_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoadmapNode" ADD CONSTRAINT "RoadmapNode_roadmapId_fkey" FOREIGN KEY ("roadmapId") REFERENCES "Roadmap"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoadmapEdge" ADD CONSTRAINT "RoadmapEdge_roadmapId_fkey" FOREIGN KEY ("roadmapId") REFERENCES "Roadmap"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRoadmap" ADD CONSTRAINT "UserRoadmap_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRoadmap" ADD CONSTRAINT "UserRoadmap_roadmapId_fkey" FOREIGN KEY ("roadmapId") REFERENCES "Roadmap"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRoadmapNode" ADD CONSTRAINT "UserRoadmapNode_userRoadmapId_fkey" FOREIGN KEY ("userRoadmapId") REFERENCES "UserRoadmap"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRoadmapNode" ADD CONSTRAINT "UserRoadmapNode_verifierId_fkey" FOREIGN KEY ("verifierId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerificationSubmission" ADD CONSTRAINT "VerificationSubmission_userRoadmapNodeId_fkey" FOREIGN KEY ("userRoadmapNodeId") REFERENCES "UserRoadmapNode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerificationSubmission" ADD CONSTRAINT "VerificationSubmission_submitterId_fkey" FOREIGN KEY ("submitterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerificationSubmission" ADD CONSTRAINT "VerificationSubmission_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
