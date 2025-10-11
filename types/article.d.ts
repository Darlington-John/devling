import { JSONContent } from '@tiptap/react';
export interface IArticle {
	_id: string;

	category: {
		title: string;
		_id: string;
	};
	duration?: number;
	description: string;
	createdAt: string;
	updatedAt: string;
	article: JSONContent;
	author: {
		_id: string;
		first_name: string;
		last_name: string;
		profile: string;
		bio: string;
	};
	image: string;
	slug: string;
	title: string;
	description: string;
	article: JSONContent;
	featured: boolean;
	published: boolean;
}

