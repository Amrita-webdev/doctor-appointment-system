import React, { useState } from 'react'
import { Button, Loader } from '../utils/components'
import { logoutUser } from '../api/auth'
import '../App.css'
import { useNavigate } from 'react-router-dom'

const Header = ({user}) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const onLogOut = async () => {
        try {
          setLoading(true);
          const token = localStorage.getItem('token');
          if (!token) {
            navigate("/"); 
            return;
          }
          await logoutUser(token);
          localStorage.removeItem('token');
          navigate("/");
        } catch (error) {
          setErrorMessage(error.message);
        } finally {
          setLoading(false);
        }
      };    
    return (
        <>
        { !loading ? 
            <div className='header__component'>
                <div className='header__container'>
                    <div className='container__left'>
                        <div>
                            <img className='logo' src='https://www.medvise.ai/images/Lgo_huea9216fc2dd81881d4e6771d40debcd2_42546_500x0_resize_q75_h2_box_3.webp' />
                        </div>
                    </div>
                    <div className='container__right'>
                        <div className='user__details'>
                            {user}
                        </div>
                        <Button handleSubmit={onLogOut} backgroundColor={'#1e88e5'} color={'white'}>Logout</Button>
                    </div>
                </div>
                {errorMessage && <div>{errorMessage}</div>}
            </div>
            : <Loader />
        }
        </>
    )
}

export default Header