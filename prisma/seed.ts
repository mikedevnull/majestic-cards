import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Clear existing data
  await prisma.playbackItem.deleteMany();

  // Create sample items
  const items = await Promise.all([
    prisma.playbackItem.create({
      data: {
        title: "Discover Weekly",
        imageUrl:
          "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=300&fit=crop",
        backendUrl: "spotify:discover-weekly",
        triggerId: "discover-1",
      },
    }),
    prisma.playbackItem.create({
      data: {
        title: "Chill Vibes",
        imageUrl:
          "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=300&fit=crop",
        backendUrl: "spotify:chill-vibes",
        triggerId: "chill-1",
      },
    }),
    prisma.playbackItem.create({
      data: {
        title: "Focus Sessions",
        imageUrl:
          "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
        backendUrl: "spotify:focus-sessions",
        triggerId: "focus-1",
      },
    }),
    prisma.playbackItem.create({
      data: {
        title: "Workout Mix",
        imageUrl:
          "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=400&h=300&fit=crop",
        backendUrl: "spotify:workout-mix",
        triggerId: "workout-1",
      },
    }),
    prisma.playbackItem.create({
      data: {
        title: "Party Hits",
        imageUrl:
          "https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=400&h=300&fit=crop",
        backendUrl: "spotify:party-hits",
        triggerId: "party-1",
      },
    }),
    prisma.playbackItem.create({
      data: {
        title: "Sleep Sounds",
        imageUrl:
          "https://images.unsplash.com/photo-1456388565407-e6cf37b5c52f?w=400&h=300&fit=crop",
        backendUrl: "spotify:sleep-sounds",
        triggerId: "sleep-1",
      },
    }),
  ]);

  console.log("Seeded database with", items.length, "items");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
