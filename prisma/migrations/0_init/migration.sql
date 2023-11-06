-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "blogs";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "sessions";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "tags";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "users";

-- CreateTable
CREATE TABLE "users"."Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions"."Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users"."User" (
    "id" TEXT NOT NULL,
    "username" TEXT,
    "name" TEXT,
    "bio" TEXT,
    "address" TEXT,
    "occupation" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT NOT NULL,
    "views" INTEGER,
    "favorites" TEXT[],
    "pinned" TEXT,
    "interests" TEXT[],
    "socials" JSONB[],
    "followers" INTEGER,
    "viewsVisibility" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions"."VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "blogs"."Blog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "authorUsername" TEXT,
    "authorImage" TEXT NOT NULL,
    "coverImage" TEXT,
    "title" TEXT NOT NULL,
    "titleId" TEXT NOT NULL,
    "reactions" TEXT[],
    "description" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "series" TEXT,
    "tags" TEXT[],
    "views" INTEGER,
    "readPerMinute" INTEGER NOT NULL,
    "new" BOOLEAN NOT NULL DEFAULT true,
    "viewsVisibility" BOOLEAN NOT NULL DEFAULT true,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Blog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags"."TagsRanking" (
    "id" TEXT NOT NULL,
    "data" JSONB[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TagsRanking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "users"."Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "sessions"."Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "users"."User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "users"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_id_name_image_key" ON "users"."User"("id", "name", "image");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "sessions"."VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "sessions"."VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "Blog_titleId_key" ON "blogs"."Blog"("titleId");

-- AddForeignKey
ALTER TABLE "users"."Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions"."Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blogs"."Blog" ADD CONSTRAINT "Blog_userId_author_authorImage_fkey" FOREIGN KEY ("userId", "author", "authorImage") REFERENCES "users"."User"("id", "name", "image") ON DELETE RESTRICT ON UPDATE CASCADE;

