import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardBody } from 'reactstrap';

export interface IBlogPreviewProps {
	_id: string;
	title: string;
	headline: string;
	author: string;
	createdAt: string;
	updatedAt: string;
	children: React.ReactNode;
}

const BlogPreview: React.FC<IBlogPreviewProps> = (props) => {
	const { _id, author, title, headline, createdAt, updatedAt, children } = props;

	return (
		<Card className="border-0">
			<CardBody className="p-0">
				<Link to={`/blogs/${_id}`} style={{ textDecoration: 'none' }} className="text-dark">
					<h2>{title}</h2>
					<h4>{headline}</h4>
					<br />
				</Link>
				{createdAt !== updatedAt ? (
					<p>
						Updated by {author} at {new Date(updatedAt).toLocaleDateString()}
					</p>
				) : (
					<p>
						Posted by {author} at {new Date(createdAt).toLocaleDateString()}
					</p>
				)}
				{children}
			</CardBody>
		</Card>
	);
};

export default BlogPreview;
