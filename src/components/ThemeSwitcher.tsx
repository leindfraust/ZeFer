import { useEffect } from 'react'
import { themeChange } from 'theme-change'

export default function ThemeSwitcher() {
    useEffect(() => {
        themeChange(false)
        // 👆 false parameter is required for react project
    }, [])

    return (<>
        <button className='btn btn-primary' data-set-theme='light'>Light</button>
        <button className='btn btn-primary' data-set-theme='dark'>Dark</button>
    </>)
}