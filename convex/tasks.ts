import { query } from "./_generated/server";

interface Task {
  _id: string;
  title: string;
  completed: boolean;
}

export const get = query({
  args: {},
  handler: async (ctx): Promise<Task[]> => {
    const tasks = (await ctx.db.query<string>("tasks").collect()) as Task[];
    return tasks;
  },
});
