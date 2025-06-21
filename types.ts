import type { Request } from "express-serve-static-core";

export type SessionRequest = Request & {
	session: {
		secretWord: string;
		// biome-ignore lint/complexity/noBannedTypes: Third Party function
		destroy: Function;
	};
};

export type FlashRequest = Request & {
	// biome-ignore lint/complexity/noBannedTypes: Third party function
	flash: Function;
};

export type User = {
	_id: string;
};
