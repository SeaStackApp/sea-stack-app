import '@dotenvx/dotenvx/config';
export default {
    schema: 'prisma/schema.prisma',
    migrations: {
        path: 'prisma/migrations',
    },
    datasource: {
        url:
            process.env.DATABASE_URL ||
            'postgresql://postgres:postgres@localhost:5432/postgres',
    },
};
