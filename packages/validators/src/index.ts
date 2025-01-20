import { z } from "zod";

export const unused = z.string().describe(
  `This lib is currently not used in the project.
   But as your application grows and you need other validators to share
   with back and frontend, you can put them in here
  `,
);
