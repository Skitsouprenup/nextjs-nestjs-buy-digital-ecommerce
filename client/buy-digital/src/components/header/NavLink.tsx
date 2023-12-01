'use client'

import Nav from 'react-bootstrap/Nav'
import { useRouter } from 'next/navigation'

interface navLinkParams {
  label: string;
  route: string;
};

const NavLink = ({label, route} : navLinkParams) => {
  const router = useRouter();

  return (
    <Nav.Link onClick={() => router.push(route)}>{label}</Nav.Link>
  )
}

export default NavLink