CREATE TABLE "groups" (
	"id" serial PRIMARY KEY NOT NULL,
	"group_id" text NOT NULL,
	CONSTRAINT "groups_group_id_unique" UNIQUE("group_id")
);
--> statement-breakpoint
CREATE TABLE "players" (
	"id" text PRIMARY KEY NOT NULL,
	"group_id" text,
	"player_name" text NOT NULL,
	"isPlaying" boolean,
	"totalGamesPlayed" integer DEFAULT 0,
	"totalRoundsWon" integer DEFAULT 0,
	"totalGamesWon" integer DEFAULT 0,
	"totalWrongClaims" integer DEFAULT 0,
	CONSTRAINT "players_group_id_player_name_unique" UNIQUE("group_id","player_name")
);
--> statement-breakpoint
CREATE TABLE "rounds" (
	"id" serial PRIMARY KEY NOT NULL,
	"round_count" integer,
	"group_id" text,
	"player_id" text,
	"points" integer
);
--> statement-breakpoint
ALTER TABLE "players" ADD CONSTRAINT "players_group_id_groups_group_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("group_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rounds" ADD CONSTRAINT "rounds_group_id_groups_group_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("group_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rounds" ADD CONSTRAINT "rounds_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."players"("id") ON DELETE no action ON UPDATE no action;