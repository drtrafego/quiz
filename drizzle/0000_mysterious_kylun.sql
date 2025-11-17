CREATE TABLE "leads" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"phone" text,
	"answers" json,
	"created_at" timestamp DEFAULT now()
);
