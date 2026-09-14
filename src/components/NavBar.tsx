import { Link, useLocation } from 'react-router-dom'

const SITE_TITLE = 'Photography Portfolio'

export default function NavBar() {
  const { pathname } = useLocation()

  if (pathname === '/') {
    return (
      <header className="menu">
        <div className="menuRotate">
          <div className="menulinkLeft">
            <Link to="/info" className="menulink">
              Info
            </Link>
          </div>
          <div className="menulinkCenter">
            <h1>
              <Link to="/" className="menulink">
                {SITE_TITLE}
              </Link>
            </h1>
          </div>
          <div className="menuRight">
            <Link to="/contacts" className="menulink">
              Contacts
            </Link>
          </div>
        </div>
      </header>
    )
  }

  const isInfo = pathname === '/info'

  return (
    <header className="menu">
      <div className="menuRotate">
        <div className="menulinkLeft">
          <Link to="/" className="menulink">
            {SITE_TITLE}
          </Link>
        </div>
        <div className="menuRight">
          {isInfo ? (
            <Link to="/contacts" className="menulink">
              Contacts
            </Link>
          ) : (
            <Link to="/info" className="menulink">
              Info
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
