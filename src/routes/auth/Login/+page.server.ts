// import type { RequestHandler } from './$types';
// import { env } from '$env/dynamic/private';

// const db = createPool({ connectionString: env.POSTGRES_URL });

// export const POST: RequestHandler = async ({ request }) => {
//   try {
//     const { email, password } = await request.json();

//     if (!email || !password) {
//       return new Response(JSON.stringify({ message: 'All fields are required.' }), { status: 400 });
//     }

//     const { rows } = await db.sql`
//       SELECT * FROM names WHERE email = ${email} AND password = ${password}
//     `;

//     if (rows.length > 0) {
//       return new Response(JSON.stringify({ message: 'Login successful.' }), { status: 200 });
//     } else {
//       return new Response(JSON.stringify({ message: 'Invalid email or password.' }), { status: 401 });
//     }
//   } catch (err) {
//     console.error('Error during login:', err);
//     return new Response(JSON.stringify({ message: 'An error occurred. Please try again later.' }), { status: 500 });
//   }
// };
