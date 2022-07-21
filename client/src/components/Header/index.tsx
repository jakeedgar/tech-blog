import React from 'react'
import { Container, Col, Row} from 'reactstrap'

export interface IHeaderProps {
    height?: string,
    image?: string,
    title: string,
    headline: string,
    children?: React.ReactNode
}

const Header: React.FC<IHeaderProps> = props => {
    const { height, image, title, headline, children } = props;

    let headerStyle = {
        background: 'linear-gradient(rgba(36, 20, 38, 0.5), rgba(36, 39, 38, 0.5)), url(' + image + ') no-repeat center center',
        WebkitBackgroundSize: 'cover',
        MozBackgroundSize: 'cover',
        OBackgroundSize: 'cover',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        width: '100%',
        height: height
    };

    return (
        <header style={headerStyle}>
            <Container>
                <Row className="align-items-center text-center">
                    <Col>
                        <h1 className="mt-5 mb-2">{title}</h1>
                        <h3 className="mb-5 text-white">{headline}</h3>
                        <p>{children}</p>
                    </Col>
                </Row>
            </Container>
        </header>
    );
}

Header.defaultProps = {
    height: '100%'
}
export default Header;
