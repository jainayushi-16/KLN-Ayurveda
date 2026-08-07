# Fix ts-node compatibility error with Node v24

## Steps
- [x] Analyze error and identify root cause (ts-node 10.9.2 incompatible with Node v24)
- [ ] Add `tsx` as a devDependency in `package.json`
- [ ] Update `dev` script to use `tsx watch src/server.ts`
- [ ] Update `prisma:seed` script to use `tsx prisma/seed.ts`
- [ ] Run `npm install` to install tsx
- [ ] Verify `npm run dev` starts the server successfully
