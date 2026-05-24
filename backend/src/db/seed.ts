import "reflect-metadata";
import { initOrm, closeOrm } from "./orm.js";
import { Book } from "./entities/book.entity.js";
import { Chapter } from "./entities/chapter.entity.js";
import { Question } from "./entities/question.entity.js";

async function seed() {
  const orm = await initOrm();
  const em = orm.em.fork();

  const existingBook = await em.findOne(Book, { title: "Thinking, Fast and Slow" });

  const book =
    existingBook ??
    em.create(Book, {
      title: "Thinking, Fast and Slow",
      author: "Daniel Kahneman",
      description: "Core seed book for v1 quiz and retention flow",
      publishedYear: 2011
    });

  if (!existingBook) {
    await em.persist(book).flush();
  }

  const chapterData = [
    {
      chapterNumber: 1,
      title: "The Characters of the Story",
      summary: "Introduces System 1 and System 2 thinking."
    },
    {
      chapterNumber: 2,
      title: "Attention and Effort",
      summary: "Explains limits of attention and mental effort."
    },
    {
      chapterNumber: 3,
      title: "The Lazy Controller",
      summary: "Describes cognitive ease and reduced vigilance."
    }
  ];

  for (const chapterInput of chapterData) {
    const existingChapter = await em.findOne(Chapter, {
      book: book.id,
      chapterNumber: chapterInput.chapterNumber
    });

    if (existingChapter) {
      existingChapter.title = chapterInput.title;
      existingChapter.summary = chapterInput.summary;
      await em.persist(existingChapter).flush();
      continue;
    }

    const chapter = em.create(Chapter, {
      book,
      chapterNumber: chapterInput.chapterNumber,
      title: chapterInput.title,
      summary: chapterInput.summary
    });

    await em.persist(chapter).flush();
  }

  const chapters = await em.find(Chapter, { book: book.id });
  const chapterByNumber = new Map(chapters.map((chapter) => [chapter.chapterNumber, chapter]));

  const questionData = [
    {
      chapterNumber: 1,
      questionText: "Which system is fast, automatic, and emotional?",
      options: ["System 1", "System 2", "Working memory", "Executive control"],
      correctAnswer: "System 1",
      explanation: "System 1 operates quickly and automatically.",
      difficulty: 1
    },
    {
      chapterNumber: 2,
      questionText: "What does the chapter \"Attention and Effort\" emphasize?",
      options: ["Unlimited focus", "Costless cognition", "Finite mental resources", "No relation to effort"],
      correctAnswer: "Finite mental resources",
      explanation: "Attention is a limited resource tied to effort.",
      difficulty: 2
    },
    {
      chapterNumber: 3,
      questionText:
        "In \"The Lazy Controller\", what happens when System 2 is not engaged?",
      options: [
        "More deliberate reasoning",
        "Reduced reliance on heuristics",
        "Greater cognitive vigilance",
        "Default acceptance of intuitive responses"
      ],
      correctAnswer: "Default acceptance of intuitive responses",
      explanation: "When System 2 is idle, System 1 responses dominate.",
      difficulty: 2
    }
  ];

  for (const questionInput of questionData) {
    const chapter = chapterByNumber.get(questionInput.chapterNumber);
    if (!chapter) {
      continue;
    }

    const existingQuestion = await em.findOne(Question, {
      chapter: chapter.id,
      questionText: questionInput.questionText
    });

    if (existingQuestion) {
      continue;
    }

    const question = em.create(Question, {
      chapter,
      questionText: questionInput.questionText,
      options: questionInput.options,
      correctAnswer: questionInput.correctAnswer,
      explanation: questionInput.explanation,
      difficulty: questionInput.difficulty,
      source: "manual",
      questionType: "mcq"
    });

    await em.persist(question).flush();
  }

  console.log("Seeding complete");
}

seed()
  .catch((error) => {
    console.error("Seeding failed", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await closeOrm();
  });
