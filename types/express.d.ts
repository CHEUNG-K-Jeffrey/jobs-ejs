declare global {
	namespace Express {
		interface User {
			_id: string; // or `Types.ObjectId`
		}
	}
}

export {};
