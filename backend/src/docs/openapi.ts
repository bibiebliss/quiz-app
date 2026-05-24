export const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "Quiz App API",
    version: "1.0.0",
    description: "HTTP API for books, chapters, quiz questions, attempts, and retention metrics."
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Local development server"
    }
  ],
  tags: [
    { name: "Health" },
    { name: "Books" },
    { name: "Chapters" },
    { name: "Quiz" },
    { name: "Attempts" },
    { name: "Retention" }
  ],
  paths: {
    "/health": {
      get: {
        tags: ["Health"],
        summary: "Health check",
        responses: {
          "200": {
            description: "Service is healthy",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { status: { type: "string", example: "ok" } },
                  required: ["status"]
                }
              }
            }
          }
        }
      }
    },
    "/books": {
      get: {
        tags: ["Books"],
        summary: "List books",
        responses: {
          "200": {
            description: "Books retrieved",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Book" }
                    }
                  },
                  required: ["data"]
                }
              }
            }
          },
          "500": { $ref: "#/components/responses/InternalServerError" }
        }
      }
    },
    "/books/{id}/chapters": {
      get: {
        tags: ["Chapters"],
        summary: "List chapters for a book",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer", minimum: 1 }
          }
        ],
        responses: {
          "200": {
            description: "Chapters retrieved",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Chapter" }
                    }
                  },
                  required: ["data"]
                }
              }
            }
          },
          "500": { $ref: "#/components/responses/InternalServerError" }
        }
      }
    },
    "/quiz": {
      get: {
        tags: ["Quiz"],
        summary: "Get quiz questions",
        parameters: [
          {
            name: "chapterId",
            in: "query",
            required: true,
            schema: { type: "integer", minimum: 1 }
          },
          {
            name: "limit",
            in: "query",
            required: false,
            schema: { type: "integer", minimum: 1, maximum: 20, default: 10 }
          },
          {
            name: "bookId",
            in: "query",
            required: false,
            schema: { type: "integer", minimum: 1 },
            description: "Accepted by validation, currently not used by service logic."
          }
        ],
        responses: {
          "200": {
            description: "Quiz questions retrieved",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/QuizQuestion" }
                    }
                  },
                  required: ["data"]
                }
              }
            }
          },
          "500": { $ref: "#/components/responses/InternalServerError" }
        }
      }
    },
    "/attempt": {
      post: {
        tags: ["Attempts"],
        summary: "Create a quiz attempt",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateAttemptRequest" }
            }
          }
        },
        responses: {
          "201": {
            description: "Attempt created",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: { $ref: "#/components/schemas/Attempt" }
                  },
                  required: ["data"]
                }
              }
            }
          },
          "500": { $ref: "#/components/responses/InternalServerError" }
        }
      }
    },
    "/retention/{userId}": {
      get: {
        tags: ["Retention"],
        summary: "Get retention metrics by user",
        parameters: [
          {
            name: "userId",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" }
          }
        ],
        responses: {
          "200": {
            description: "Retention metrics retrieved",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/RetentionRow" }
                    }
                  },
                  required: ["data"]
                }
              }
            }
          },
          "500": { $ref: "#/components/responses/InternalServerError" }
        }
      }
    }
  },
  components: {
    responses: {
      InternalServerError: {
        description: "Internal server error",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                error: { type: "string", example: "Internal Server Error" }
              },
              required: ["error"]
            }
          }
        }
      }
    },
    schemas: {
      Book: {
        type: "object",
        properties: {
          id: { type: "integer", format: "int64" },
          title: { type: "string" },
          author: { type: "string" },
          description: { type: "string", nullable: true },
          published_year: { type: "integer", nullable: true }
        },
        required: ["id", "title", "author", "description", "published_year"]
      },
      Chapter: {
        type: "object",
        properties: {
          id: { type: "integer", format: "int64" },
          book_id: { type: "integer", format: "int64" },
          chapter_number: { type: "integer" },
          title: { type: "string" },
          summary: { type: "string", nullable: true }
        },
        required: ["id", "book_id", "chapter_number", "title", "summary"]
      },
      QuizQuestion: {
        type: "object",
        properties: {
          id: { type: "integer", format: "int64" },
          chapterId: { type: "integer", format: "int64" },
          questionText: { type: "string" },
          questionType: { type: "string", enum: ["mcq"] },
          options: { type: "array", items: { type: "string" } },
          difficulty: { type: "integer" },
          source: { type: "string", enum: ["manual", "ai"] },
          explanation: { type: "string", nullable: true }
        },
        required: [
          "id",
          "chapterId",
          "questionText",
          "questionType",
          "options",
          "difficulty",
          "source",
          "explanation"
        ]
      },
      CreateAttemptRequest: {
        type: "object",
        properties: {
          userId: { type: "string", format: "uuid" },
          questionId: { type: "integer", minimum: 1 },
          selectedAnswer: { type: "string", minLength: 1 },
          responseMs: { type: "integer", minimum: 0 },
          confidence: { type: "integer", minimum: 1, maximum: 5 }
        },
        required: ["userId", "questionId", "selectedAnswer"]
      },
      Attempt: {
        type: "object",
        properties: {
          id: { type: "integer", format: "int64" },
          user_id: { type: "string", format: "uuid" },
          question_id: { type: "integer", format: "int64" },
          selected_answer: { type: "string" },
          is_correct: { type: "boolean" },
          response_ms: { type: "integer", nullable: true },
          confidence: { type: "integer", nullable: true },
          attempted_at: { type: "string", format: "date-time" }
        },
        required: [
          "id",
          "user_id",
          "question_id",
          "selected_answer",
          "is_correct",
          "response_ms",
          "confidence",
          "attempted_at"
        ]
      },
      RetentionRow: {
        type: "object",
        properties: {
          chapterId: { type: "integer", format: "int64" },
          chapterTitle: { type: "string" },
          totalAttempts: { type: "integer" },
          correctAttempts: { type: "integer" },
          avgConfidence: { type: "number", nullable: true },
          retentionScore: { type: "integer" },
          lastAttemptAt: { type: "string" }
        },
        required: [
          "chapterId",
          "chapterTitle",
          "totalAttempts",
          "correctAttempts",
          "avgConfidence",
          "retentionScore",
          "lastAttemptAt"
        ]
      }
    }
  }
} as const;

