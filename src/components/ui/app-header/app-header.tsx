/* eslint-disable */
import React, { FC } from 'react';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => {
  const location = useLocation();
  const isProfilePage = location.pathname.startsWith('/profile');
  return (
    <header className={styles.header}>
    <nav className={`${styles.menu} p-4`}>
      <div className={`${styles.menu_part_left} ${location.pathname === '/' ? styles.link_active : styles.link}`}>
        <BurgerIcon type={location.pathname === '/' ? 'primary' : 'secondary'}  />
        <Link to='/' className='text text_type_main-default ml-2 mr-10'>Конструктор</Link>
      </div>
      <div className={`${styles.menu_part_left} ${location.pathname === '/feed' ? styles.link_active : styles.link}`}>
        <ListIcon type={location.pathname === '/feed' ? 'primary' : 'secondary'}  />
        <Link to='/feed' className='text text_type_main-default ml-2'>Лента заказов</Link>
      </div>
      <div className={styles.logo}>
        <Logo className='' />
      </div>
      <div className={`${isProfilePage ? styles.link_active : styles.link} ${styles.link_position_last}`}>
        <ProfileIcon type={isProfilePage ? 'primary' : 'secondary'}  />
        <Link to='/profile' className='text text_type_main-default ml-2'>
          {userName || 'Личный кабинет'}
        </Link>
      </div>
    </nav>
  </header>
  )
};
