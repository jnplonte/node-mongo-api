export {};

declare module '*.json' {
	const value: any;
	export default value;
}

declare global {
	namespace Express {
		interface Request {
			authentication: {
				id: string;
				phone?: string;
				roleId?: number;
			};
			models?: any;
		}
		interface Response {
			startTime?: number;
		}
	}
}
