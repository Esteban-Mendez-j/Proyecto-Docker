// import jwt from 'jsonwebtoken';

// export async function get({ request }) {
//   const cookieHeader = request.headers.get('cookie') || '';
//   const cookies = Object.fromEntries(cookieHeader.split(';').map(c => c.trim().split('=')));
//   const token = cookies['jwt'];

//   if (!token) {
//     return new Response(JSON.stringify({ autorizado: false }), { status: 404 });
//   }

//   try {
//     const decoded = jwt.verify(token, import.meta.env.JWT_SECRET);
//     const autorizado = decoded.rol === 'ADMIN' || decoded.rol === 'SUPER_ADMIN';

//     return new Response(JSON.stringify({ autorizado }), {
//       status: 200,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   } catch {
//     return new Response(JSON.stringify({ autorizado: false }), { status: 404 });
//   }
// }