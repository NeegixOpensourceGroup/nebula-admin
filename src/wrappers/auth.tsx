import { Navigate,Outlet } from 'umi';

 function auth() {
    const isLogin  = sessionStorage.getItem('token')
    
    if(isLogin){
        return <Outlet />
    }else{
        return <Navigate to='/login' />
    }
}

export default auth
