-- CreateTable
CREATE TABLE "IngredientSet" (
    "id" SERIAL NOT NULL,
    "ingredients" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "IngredientSet_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "IngredientSet" ADD CONSTRAINT "IngredientSet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
