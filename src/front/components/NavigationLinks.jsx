import React from 'react'

import { FormattedMessage } from 'react-intl'

const NavigationLinks = () => {
  return (
    <nav className={`navigation-links-nav `}>
      <span className="navigation-links-text">{<FormattedMessage id="nav_item1_text"/>}</span>
      <span className="navigation-links-text1">{<FormattedMessage id="nav_item2_text"/>}</span>
      <span className="navigation-links-text2">{<FormattedMessage id="nav_item3_text"/>}</span>
      <span className="navigation-links-text3">{<FormattedMessage id="nav_item4_text"/>}</span>
      <span className="navigation-links-text4">{<FormattedMessage id="nav_item5_text"/>}</span>
    </nav>
  )
}

export default NavigationLinks
