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

async function readUsers(): Promise<DemoUser[]> {
  const fileContent = await fs.readFile(usersFilePath, 'utf-8');
  return JSON.parse(fileContent) as DemoUser[];
}

async function writeUsers(users: DemoUser[]): Promise<void> {
  await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), 'utf-8');
}

export async function GET() {
  const users = await readUsers();
  return NextResponse.json({
    users: users.map(({ password, ...user }) => user),
  });
}

export async function POST(request: Request) {
  const body = (await request.json()) as Partial<DemoUser>;

  if (!body.name || !body.email || !body.password) {
    return NextResponse.json({ error: 'name, email, and password are required' }, { status: 400 });
  }

  const users = await readUsers();
  const existingUser = users.find((user) => user.email.toLowerCase() === body.email?.toLowerCase());

  if (existingUser) {
    return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
  }

  const newUser: DemoUser = {
    id: `user-${Date.now()}`,
    name: body.name,
    email: body.email,
    password: body.password,
  };

  const updatedUsers = [...users, newUser];
  await writeUsers(updatedUsers);

  return NextResponse.json(
    {
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
    },
    { status: 201 }
  );
}
