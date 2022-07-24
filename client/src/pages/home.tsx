import React, { useEffect, useState } from 'react';
import { Container } from 'reactstrap';
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import IBlog from '../interfaces/blog';
import IPageProps from '../interfaces/page';
import config from '../config/config';
import { Link } from 'react-router-dom';
import axios from 'axios';
import logging from '../config/logging';
import LoadingComponent from '../components/LoadingComponent';
import BlogPreview from '../components/BlogPreview';
import IUser from '../interfaces/user';
import ErrorText from '../components/ErrorText';

const HomePage: React.FC<IPageProps> = (props) => {
	const [blogs, setBlogs] = useState<IBlog[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string>('');

	useEffect(() => {
		GetAllBlogs();
	}, []);

	const GetAllBlogs = async () => {
		try {
			const response = await axios({
				method: 'Get',
				url: `${config.server.url}/blogs`
			});

			if (response.status === 200 || response.status === 304) {
				let blogs = response.data.blogs as IBlog[];
				blogs.sort((x, y) => y.updatedAt.localeCompare(x.updatedAt));
				setBlogs(blogs);
			}
		} catch (error) {
			logging.error(error);
			setError('Unable to get that blog friend ...');
		} finally {
			setTimeout(() => {
				setLoading(false);
			}, 1000);
		}
	};
	if (loading) {
		return <LoadingComponent>Loading Blogs ...</LoadingComponent>;
	}
	return (
		<Container fluid className="p-0">
			<Navigation />
			<Header title="Jake's Blog" headline="Some stuff you'd write about" children={' '} />
			<Container className="mt-5">
				{blogs.length === 0 && (
					<p>
						There are no blogs yet, you should <Link to="/edit">Post </Link>one.
					</p>
				)}
				{blogs.map((blog, index) => {
					return (
						<div key={index}>
							<BlogPreview _id={blog._id} author={(blog.author as IUser).name} headline={blog.headline} title={blog.title} createdAt={blog.createdAt} updatedAt={blog.updatedAt} children={undefined} />
							<hr />
						</div>
					);
				})}
				<ErrorText error={error} />
			</Container>
		</Container>
	);
};

export default HomePage;
