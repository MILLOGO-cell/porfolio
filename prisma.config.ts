import { defineConfig } from 'prisma/config';

export default defineConfig({
  datasource: {
    url: "postgresql://postgres@127.0.0.1:5433/portfolio?schema=public"
  }
});