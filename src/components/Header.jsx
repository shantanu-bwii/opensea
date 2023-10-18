import React from 'react'
import {NavLink} from 'react-router-dom'

const Header = ({ web3Handler, account }) => {
    return (
        <div>
            <nav class="bg-white dark:bg-gray-800  shadow ">
                <div class="px-8 mx-auto max-w-7xl">
                    <div class="flex items-center justify-between h-16">
                        <div class=" flex items-center">
                            <NavLink class="flex-shrink-0" to={'/'}>
                                <img class="w-8 h-8" src="logo192.png" alt="Workflow" />
                            </NavLink>
                            <div class="hidden md:block">
                                <div class="flex items-baseline ml-10 space-x-4">
                                    <NavLink class="text-gray-300  hover:text-gray-800 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium" to={'/'}>
                                        Home
                                    </NavLink>
                                    <NavLink class="text-gray-800 dark:text-white  hover:text-gray-800 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium" to={'/create'}>
                                        Create
                                    </NavLink>
                                    <NavLink class="text-gray-300  hover:text-gray-800 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium" to={'/my-listed-items'}>
                                        My Items
                                    </NavLink>
                                    <NavLink class="text-gray-300  hover:text-gray-800 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium" to={'/my-purchases'}>
                                        My Purchases
                                    </NavLink>
                                </div>
                            </div>
                        </div>
                        <div class="block">
                            <div class="flex items-center ml-4 md:ml-6">
                                <div class="relative ml-3">
                                    <div class="relative inline-block text-left">
                                        {account ? (
                                            <button className='bg-orange-700 p-2 text-white'>{account.slice(0, 4)}...{account.slice(-4)}</button>
                                        ) : (
                                            <button onClick={web3Handler} className='bg-orange-500 p-2 text-white'>Connect to MetaMask</button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="flex -mr-2 md:hidden">
                            <button class="text-gray-800 dark:text-white hover:text-gray-300 inline-flex items-center justify-center p-2 rounded-md focus:outline-none">
                                <svg width="20" height="20" fill="currentColor" class="w-8 h-8" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1664 1344v128q0 26-19 45t-45 19h-1408q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h1408q26 0 45 19t19 45zm0-512v128q0 26-19 45t-45 19h-1408q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h1408q26 0 45 19t19 45zm0-512v128q0 26-19 45t-45 19h-1408q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h1408q26 0 45 19t19 45z">
                                    </path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="md:hidden">
                    <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <NavLink class="text-gray-300 hover:text-gray-800 dark:hover:text-white block px-3 py-2 rounded-md text-base font-medium" to={'/'}>
                            Home
                        </NavLink>
                        <NavLink class="text-gray-800 dark:text-white block px-3 py-2 rounded-md text-base font-medium" to={'/create'}>
                            Create
                        </NavLink>
                        <NavLink class="text-gray-300 hover:text-gray-800 dark:hover:text-white block px-3 py-2 rounded-md text-base font-medium" to={'/my-listed-items'}>
                            My Items
                        </NavLink>
                        <NavLink class="text-gray-300 hover:text-gray-800 dark:hover:text-white block px-3 py-2 rounded-md text-base font-medium" to={'/my-purchases'}>
                            My Purchases
                        </NavLink>
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default Header
