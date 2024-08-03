import { AppDispatch } from "@/state";
import { updateUserDarkMode } from "@/state/user/actions";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

function HandleDexTheme() {

  const routeToAvoid = ['exchange', 'add', 'remove', 'farm', 'pool', 'swap']
const {asPath} = useRouter()

  const dispatch = useDispatch<AppDispatch>();
   useEffect(() => {
      routeToAvoid.some(route => asPath.includes(route)) ?   dispatch(updateUserDarkMode({ userDarkMode: true }))  :null
  
   }, [asPath])
  
  return null
}


export default HandleDexTheme