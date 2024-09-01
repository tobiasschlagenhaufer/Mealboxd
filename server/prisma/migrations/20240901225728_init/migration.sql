-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "googleId" TEXT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RestaurantRating" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "placeId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RestaurantRating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Restaurant" (
    "placeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "sumRatings" INTEGER NOT NULL,
    "numRatings" INTEGER NOT NULL,
    "website" TEXT,
    "address" TEXT NOT NULL,

    CONSTRAINT "Restaurant_pkey" PRIMARY KEY ("placeId")
);

-- CreateTable
CREATE TABLE "_UserFavourites" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "RestaurantRating_placeId_idx" ON "RestaurantRating"("placeId");

-- CreateIndex
CREATE UNIQUE INDEX "Restaurant_address_key" ON "Restaurant"("address");

-- CreateIndex
CREATE UNIQUE INDEX "_UserFavourites_AB_unique" ON "_UserFavourites"("A", "B");

-- CreateIndex
CREATE INDEX "_UserFavourites_B_index" ON "_UserFavourites"("B");

-- AddForeignKey
ALTER TABLE "RestaurantRating" ADD CONSTRAINT "RestaurantRating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserFavourites" ADD CONSTRAINT "_UserFavourites_A_fkey" FOREIGN KEY ("A") REFERENCES "Restaurant"("placeId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserFavourites" ADD CONSTRAINT "_UserFavourites_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
