import React from 'react'
import BurgerMenu from './BurgerMenu'

const Menu = () => {
    return (
        <section className='flex flex-col w-[15%] md:w-[10%] items-center h-full border text-2xl'>
            <BurgerMenu/>
        </section>
    )
}

export default Menu