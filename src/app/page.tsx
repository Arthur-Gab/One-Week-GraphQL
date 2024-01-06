const greetings = async () => {
	'use server';

	const res = await fetch('http://localhost:3000/api/graphql', {
		method: 'POST',
		body: JSON.stringify({
			query: `#graphql
				query {
  					greetings
				}
			`,
		}),
		headers: {
			'content-type': 'application/json',
		},
	});
	const { data }: { data: { greetings: string } } = await res.json();

	return {
		data,
	};
};

export default async function Home() {
	const res = await greetings();

	return (
		<>
			<h1>Hello World</h1>
			<p>{res.data.greetings}</p>
		</>
	);
}
