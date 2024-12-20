import { NavLink } from 'react-router';

function About() {
  return (
    <div>
      About
      <NavLink to='/' end>
        Home
      </NavLink>
    </div>
  );
}

export default About;
