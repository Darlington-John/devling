export interface ITopic {
	_id: string;
	title: string;
	slug: string;
	description: string;
	image: string;
	createdAt: Date | string;
	updatedAt: Date;
}
