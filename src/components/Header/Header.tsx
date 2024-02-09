import React from 'react';
import { Link } from 'react-router-dom';
import Media from 'react-media';
import s from './Header.module.scss';

const Header: React.FC = () => {
    return <header className={s.header}>
        <Link to={'/'}></Link>
        
        <Media queries={{
            small: "(max-width: 480px)",
            medium: "(max-width: 859px)",
            large: "(min-width: 860px)"
        }}>
            {matches => (
            <>
                {matches.large && <>
                    
                </>}
            </>
            )}
        </Media>
    </header>
};

export default Header;