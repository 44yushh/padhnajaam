import { promises as fs } from 'node:fs';
import path from 'node:path';
import { NextResponse } from 'next/server';

interface DemoUser {
  id: string;
  name: string;
  email: string;
  password: string;
}

const usersFilePath = path.join(process.cwd(), 'data', 'users.json');

export async function POST(request: Request) {
  const body = (await request.json()) as Partial<DemoUser>;

  if (!body.email || !body.password) {
    return NextResponse.json({ error: 'email and password are required' }, { status: 400 });
  }

  const fileContent = await fs.readFile(usersFilePath, 'utf-8');
  const users = JSON.parse(fileContent) as DemoUser[];

  const user = users.find(
    (item) => item.email.toLowerCase() === body.email?.toLowerCase() && item.password === body.password
  );

  if (!user) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  return NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  });
}
