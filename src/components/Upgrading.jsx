import {
  createContext,
  useEffect,
  useState,
  useRef,
  forwardRef,
  useImperativeHandle
} from 'react'
import axios from 'axios'
import Material from './Material'
import '../css/Upgrading.css'
import Popup from 'reactjs-popup'
import Character from './Character'
import CharUpgrade from './CharUpgrade'
import chars from '../json/characters.json'
import mats from '../json/materials.json'
export const UpgradeContext = createContext(null)

function Upgrading () {
  const VERSION = '1.0'

  const getMats = () => {
    if (localStorage.getItem('materials') === null) {
      let materials = []
      for (let i = 0; i < mats.length; i++) {
        materials.push(mats[i])
      }
      localStorage.setItem('materials', JSON.stringify(materials))
      return materials
    } else {
      let materials = []
      let m = JSON.parse(localStorage.getItem('materials'))
      for (let i = 0; i < m.length; i++) {
        materials.push(m[i])
      }
      if (materials.length < mats.length) {
        for (let i = 0; i < mats.length; i++) {
          if (!materials.find(m => m.name === mats[i].name)) {
            materials.splice(i, 0, mats[i])
          }
        }
        for (let i = 0; i < materials.length; i++) {
          if (!mats.find(m => m.name === materials[i].name)) {
            materials.splice(i, 1)
          }
        }
      } else if (materials.length > mats.length) {
        for (let i = 0; i < mats.length; i++) {
          if (!materials.find(m => m.name === mats[i].name)) {
            materials.splice(i, 0, mats[i])
          }
        }
        for (let i = 0; i < materials.length; i++) {
          if (!mats.find(m => m.name === materials[i].name)) {
            materials.splice(i, 1)
          }
        }
      }

      for (let i = 0; i < materials.length; i++) {
        let keys = Object.keys(mats[i])
        for (let j = 0; j < keys.length; j++) {
          if (!materials[i].hasOwnProperty(keys[j])) {
            materials[i][keys[j]] = mats[i][keys[j]]
          }
        }
      }

      const allowedKeys = Array.from(
        new Set(mats.flatMap(obj => Object.keys(obj)))
      )

      materials = materials.map(obj => {
        return Object.fromEntries(
          Object.entries(obj).filter(([key]) => allowedKeys.includes(key))
        )
      })

      localStorage.setItem('materials', JSON.stringify(materials))
      return materials
    }
  }

  const [materials, setMaterials] = useState(getMats())
  const [characters, setCharacters] = useState(chars)
  const [displaying, setDisplaying] = useState(chars)
  const [upgrade, setUpgrade] = useState([])

  useEffect(() => {
    if (localStorage.getItem('upgrade') !== null) {
      setUpgrade(JSON.parse(localStorage.getItem('upgrade')))
    }
  }, [])

  const clearLocStor = () => {
    localStorage.clear()
    window.location.reload()
  }

  const handleFiltering = () => {
    let characters = chars
    let ranks = []
    let roles = []
    for (
      let i = 0;
      i < document.getElementsByClassName('checkbox-btn').length;
      i++
    ) {
      if (
        document.getElementsByClassName('checkbox-btn')[i].firstChild.checked
      ) {
        if (
          document.getElementsByClassName('checkbox-btn')[i].title.length === 1
        ) {
          ranks.push(document.getElementsByClassName('checkbox-btn')[i].title)
        } else {
          roles.push(document.getElementsByClassName('checkbox-btn')[i].title)
        }
      }
    }
    characters = characters.filter(c => upgrade.find(u => c.id === u.id))
    characters = characters.filter(character => {
      if (ranks.length > 0) {
        if (ranks.includes(character.rank)) {
          return true
        }
        return false
      }
      return true
    })
    characters = characters.filter(character => {
      if (roles.length > 0) {
        if (roles.includes(character.role)) {
          return true
        }
        return false
      }
      return true
    })
    setCharacters(characters)
  }

  const handleFiltering2 = () => {
    let characters = chars
    let ranks = []
    let roles = []
    let released = false
    for (
      let i = 0;
      i <
      document.querySelector('#overlay').querySelectorAll('.checkbox-btn')
        .length;
      i++
    ) {
      if (
        document.querySelector('#overlay').querySelectorAll('.checkbox-btn')[i]
          .firstChild.checked
      ) {
        if (
          document.querySelector('#overlay').querySelectorAll('.checkbox-btn')[
            i
          ].title.length === 1
        ) {
          ranks.push(
            document
              .querySelector('#overlay')
              .querySelectorAll('.checkbox-btn')[i].title
          )
        } else if (
          document.querySelector('#overlay').querySelectorAll('.checkbox-btn')[
            i
          ].title === 'released'
        ) {
          released = true
        } else {
          roles.push(
            document
              .querySelector('#overlay')
              .querySelectorAll('.checkbox-btn')[i].title
          )
        }
      }
    }
    characters = characters.filter(c => chars.find(u => c.id === u.id))
    characters = characters.filter(character => {
      if (ranks.length > 0) {
        if (ranks.includes(character.rank)) {
          return true
        }
        return false
      }
      return true
    })
    characters = characters.filter(character => {
      if (roles.length > 0) {
        if (roles.includes(character.role)) {
          return true
        }
        return false
      }
      return true
    })
    // for (let i = 0; i < characters.length; i++) {
    //   console.log(characters[i].released)
    // }
    if (released === true) {
      characters = characters.filter(
        character => character.released === released
      )
    }
    setDisplaying(characters)
  }

  for (let i = 0; i < materials.length; i++) {
    if (materials[i].craftable != null && materials[i].canCraft == null) {
      let names = materials.filter(m =>
        m.name.includes(materials[i].name.split(' ')[0])
      )
      if (names.length === 4) {
        // if (materials[i].amount >= materials[i].needed) {
        materials[i + 1].canCraft = Math.max(
          Math.min(
            Math.floor((materials[i].amount - materials[i].needed) / 3),
            materials[i + 1].needed -
              materials[i + 1].amount +
              Math.max(
                (materials[i + 2].needed - materials[i + 2].amount) * 3,
                0
              ) +
              Math.max(
                (materials[i + 3].needed - materials[i + 3].amount) * 9,
                0
              )
          ),
          0
        )

        materials[i + 2].canCraft = Math.max(
          Math.min(
            Math.floor(
              (parseInt(materials[i + 1].amount) +
                parseInt(materials[i + 1].canCraft) -
                materials[i + 1].needed) /
                3
            ),
            materials[i + 2].needed -
              materials[i + 2].amount +
              Math.max(
                (materials[i + 3].needed - materials[i + 3].amount) * 3,
                0
              )
          ),
          0
        )

        materials[i + 3].canCraft = Math.max(
          Math.min(
            Math.floor(
              (parseInt(materials[i + 2].amount) +
                parseInt(materials[i + 2].canCraft) -
                materials[i + 2].needed) /
                3
            ),
            Math.max(materials[i + 3].needed - materials[i + 3].amount, 0)
          ),
          0
        )

        let json = JSON.parse(localStorage.getItem('materials'))
        let mat_ii = json.findIndex(obj => obj.name === materials[i + 1].name)
        json[mat_ii].canCraft = materials[i + 1].canCraft
        let mat_iii = json.findIndex(obj => obj.name === materials[i + 2].name)
        json[mat_iii].canCraft = materials[i + 2].canCraft
        let mat_iv = json.findIndex(obj => obj.name === materials[i + 3].name)
        json[mat_iv].canCraft = materials[i + 3].canCraft
        localStorage.setItem('materials', JSON.stringify(json))
      }
      if (names.length === 3) {
        materials[i + 1].canCraft = Math.max(
          Math.min(
            Math.floor((materials[i].amount - materials[i].needed) / 3),
            materials[i + 1].needed -
              materials[i + 1].amount +
              Math.max(
                (materials[i + 2].needed - materials[i + 2].amount) * 3,
                0
              )
          ),
          0
        )
        materials[i + 2].canCraft = Math.max(
          Math.min(
            Math.floor(
              (parseInt(materials[i + 1].amount) +
                parseInt(materials[i + 1].canCraft) -
                materials[i + 1].needed) /
                3
            ),
            Math.max(materials[i + 2].needed - materials[i + 2].amount, 0)
          ),
          0
        )
        let json = JSON.parse(localStorage.getItem('materials'))
        let mat_ii = json.findIndex(obj => obj.name === materials[i + 1].name)
        json[mat_ii].canCraft = materials[i + 1].canCraft
        let mat_iii = json.findIndex(obj => obj.name === materials[i + 2].name)
        json[mat_iii].canCraft = materials[i + 2].canCraft
        localStorage.setItem('materials', JSON.stringify(json))
      }
    }
  }

  const materialsRefs = useRef({})

  const setOtherValue = (targetId, newValue) => {
    const ref = materialsRefs.current[targetId]
    if (ref && ref.setValue) {
      ref.setValue(newValue)
    }
  }
  const updateVersion = () => {
    localStorage.setItem('VERSION', VERSION)

    let u = JSON.parse(localStorage.getItem('upgrade'))
    if (u !== undefined) {
      for (let j = 0; j < u.length; j++) {
        let c = characters.find(ch => ch.id === u[j].id)

        for (
          let i = parseInt(u[j].currPhase);
          i < parseInt(u[j].goalPhase);
          i++
        ) {
          for (let j = 0; j < c.phases[i].length; j++) {
            let material = materials.find(m => m.name === c.phases[i][j][0])
            material.needed += c.phases[i][j][1]

            const index = material.characters.findIndex(
              char => char.name === c.name
            )
            if (index !== -1) {
              material.characters[index].amount += c.phases[i][j][1]
            } else {
              material.characters.push({
                name: c.name,
                amount: c.phases[i][j][1]
              })
            }
          }
        }
        for (
          let i = parseInt(u[j].currSkill1);
          i < parseInt(u[j].goalSkill1);
          i++
        ) {
          for (let j = 0; j < c.skills[i - 1].length; j++) {
            let material = materials.find(m => m.name === c.skills[i - 1][j][0])
            material.needed += c.skills[i - 1][j][1]

            const index = material.characters.findIndex(
              char => char.name === c.name
            )
            if (index !== -1) {
              material.characters[index].amount += c.skills[i - 1][j][1]
            } else {
              material.characters.push({
                name: c.name,
                amount: c.skills[i - 1][j][1]
              })
            }
          }
        }
        for (
          let i = parseInt(u[j].currSkill2);
          i < parseInt(u[j].goalSkill2);
          i++
        ) {
          for (let j = 0; j < c.skills[i - 1].length; j++) {
            let material = materials.find(m => m.name === c.skills[i - 1][j][0])
            material.needed += c.skills[i - 1][j][1]

            const index = material.characters.findIndex(
              char => char.name === c.name
            )
            if (index !== -1) {
              material.characters[index].amount += c.skills[i - 1][j][1]
            } else {
              material.characters.push({
                name: c.name,
                amount: c.skills[i - 1][j][1]
              })
            }
          }
        }
        for (
          let i = parseInt(u[j].currSkill3);
          i < parseInt(u[j].goalSkill3);
          i++
        ) {
          for (let j = 0; j < c.skills[i - 1].length; j++) {
            let material = materials.find(m => m.name === c.skills[i - 1][j][0])
            material.needed += c.skills[i - 1][j][1]

            const index = material.characters.findIndex(
              char => char.name === c.name
            )
            if (index !== -1) {
              material.characters[index].amount += c.skills[i - 1][j][1]
            } else {
              material.characters.push({
                name: c.name,
                amount: c.skills[i - 1][j][1]
              })
            }
          }
        }
        for (
          let i = parseInt(u[j].currSkill4);
          i < parseInt(u[j].goalSkill4);
          i++
        ) {
          for (let j = 0; j < c.skills[i - 1].length; j++) {
            let material = materials.find(m => m.name === c.skills[i - 1][j][0])
            material.needed += c.skills[i - 1][j][1]

            const index = material.characters.findIndex(
              char => char.name === c.name
            )
            if (index !== -1) {
              material.characters[index].amount += c.skills[i - 1][j][1]
            } else {
              material.characters.push({
                name: c.name,
                amount: c.skills[i - 1][j][1]
              })
            }
          }
        }
        for (let i = parseInt(u[j].currECB); i < parseInt(u[j].goalECB); i++) {
          for (let j = 0; j < c.ecb[i].length; j++) {
            let material = materials.find(m => m.name === c.ecb[i][j][0])
            material.needed += c.ecb[i][j][1]

            const index = material.characters.findIndex(
              char => char.name === c.name
            )
            if (index !== -1) {
              material.characters[index].amount += c.ecb[i][j][1]
            } else {
              material.characters.push({
                name: c.name,
                amount: c.ecb[i][j][1]
              })
            }
          }
        }
      }
    }

    localStorage.setItem('materials', materials)
    window.location.reload()
  }

  return (
    <div className='container'>
      {/*NOTE: выбор персонажей для прокачки */}
      {localStorage.getItem('VERSION') !== VERSION && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'white',
            color: '#333',
            padding: '12px 16px',
            textAlign: 'center',
            alignItems: 'center',
            zIndex: 1000,
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
            animation: 'slideDown 0.3s ease-out',
            borderRadius: '10px'
          }}
        >
          <p>Доступна новая версия: </p>
          <button
            style={{
              backgroundColor: '#333',
              color: '#fff',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
            onClick={() => updateVersion()}
          >
            Обновить страницу
          </button>
        </div>
      )}
      <Popup
        trigger={
          <button
            onClick={() => {
              setDisplaying(chars)
            }}
          >
            Add character
          </button>
        }
        modal
        nested
        position='center center'
        lockScroll={true}
        onOpen={() => setDisplaying(chars)}
      >
        {close => (
          <div
            id='overlay'
            style={{ border: '10px solid gray', outline: '2px solid black' }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                paddingBottom: '10px',
                position: 'fixed',
                left: '50%',
                transform: 'translate(-50%, -0%)'
              }}
            >
              <div
                style={{
                  backgroundColor: 'gray',
                  width: 'fit-content',
                  paddingLeft: '5px',
                  paddingBottom: '5px',
                  borderTopLeftRadius: '5px',
                  borderBottomLeftRadius: '5px'
                }}
              >
                <label
                  className='checkbox-btn'
                  title='S'
                  onChange={handleFiltering2}
                >
                  <input type='checkbox' />
                  <span
                    style={{
                      color: '#f6af5a',
                      fontSize: '30px',
                      textShadow:
                        '-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black'
                    }}
                  >
                    S
                  </span>
                </label>
                <label
                  className='checkbox-btn'
                  title='A'
                  onChange={handleFiltering2}
                >
                  <input type='checkbox' />
                  <span
                    style={{
                      color: '#b051f9',
                      fontSize: '30px',
                      textShadow:
                        '-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black'
                    }}
                  >
                    A
                  </span>
                </label>
                <label
                  className='checkbox-btn'
                  title='B'
                  onChange={handleFiltering2}
                >
                  <input type='checkbox' />
                  <span
                    style={{
                      color: '#4594df',
                      fontSize: '30px',
                      textShadow:
                        '-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black'
                    }}
                  >
                    B
                  </span>
                </label>
              </div>
              <div style={{ backgroundColor: 'gray', width: 'fit-content' }}>
                <label
                  className='checkbox-btn'
                  title='Arcane'
                  onChange={handleFiltering2}
                >
                  <input type='checkbox' />
                  <span style={{ height: '30px' }}>
                    <img
                      style={{
                        color: '#f6af5a',
                        height: '30px',
                        textShadow:
                          '-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black'
                      }}
                      src='https://patchwiki.biligame.com/images/wqmt/thumb/0/04/kjdbfa801wc49rfmcfz1mhezx20vzsg.png/45px-%E5%BC%82%E8%83%BDtj.png'
                      alt='Arcane'
                    />
                  </span>
                </label>
                <label
                  className='checkbox-btn'
                  title='Catalyst'
                  onChange={handleFiltering2}
                >
                  <input type='checkbox' />
                  <span style={{ height: '30px' }}>
                    <img
                      style={{
                        color: '#f6af5a',
                        height: '30px',
                        textShadow:
                          '-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black'
                      }}
                      src='https://patchwiki.biligame.com/images/wqmt/thumb/5/56/afsn6zrqt9fb5m4h71gkj4yxufw10eo.png/45px-%E5%90%AF%E8%BF%AAtj.png'
                      alt='Catalyst'
                    />
                  </span>
                </label>
                <label
                  className='checkbox-btn'
                  title='Endura'
                  onChange={handleFiltering2}
                >
                  <input type='checkbox' />
                  <span style={{ height: '30px' }}>
                    <img
                      style={{
                        color: '#f6af5a',
                        height: '30px',
                        textShadow:
                          '-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black'
                      }}
                      src='https://patchwiki.biligame.com/images/wqmt/thumb/6/62/8alscnkyv5l7qwvviz86u1j4jgqzqlp.png/45px-%E5%9D%9A%E9%9F%A7tj.png'
                      alt='Endura'
                    />
                  </span>
                </label>
                <label
                  className='checkbox-btn'
                  title='Fury'
                  onChange={handleFiltering2}
                >
                  <input type='checkbox' />
                  <span style={{ height: '30px' }}>
                    <img
                      style={{
                        color: '#f6af5a',
                        height: '30px',
                        textShadow:
                          '-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black'
                      }}
                      src='https://patchwiki.biligame.com/images/wqmt/thumb/1/1f/lpqagh7xroz987q9ucfqk83j17sk8uw.png/45px-%E7%8B%82%E6%9A%B4tj.png'
                      alt='Fury'
                    />
                  </span>
                </label>
                <label
                  className='checkbox-btn'
                  title='Reticle'
                  onChange={handleFiltering2}
                >
                  <input type='checkbox' />
                  <span style={{ height: '30px' }}>
                    <img
                      style={{
                        color: '#f6af5a',
                        height: '30px',
                        textShadow:
                          '-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black'
                      }}
                      src='https://patchwiki.biligame.com/images/wqmt/thumb/4/49/divbvnk0fgxukcgr2cwryv3630pgoc5.png/45px-%E7%B2%BE%E5%87%86tj.png'
                      alt='Reticle'
                    />
                  </span>
                </label>
                <label
                  className='checkbox-btn'
                  title='Umbra'
                  onChange={handleFiltering2}
                >
                  <input type='checkbox' />
                  <span style={{ height: '30px' }}>
                    <img
                      style={{
                        color: '#f6af5a',
                        height: '30px',
                        textShadow:
                          '-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black'
                      }}
                      src='https://patchwiki.biligame.com/images/wqmt/thumb/e/ee/otwzjaknerpqcaif3qh23vqtn7t2kzp.png/45px-%E8%AF%A1%E7%A7%98tj.png'
                      alt='Umbra'
                    />
                  </span>
                </label>
              </div>
              <div
                style={{
                  backgroundColor: 'gray',
                  width: 'fit-content',
                  borderTopRightRadius: '5px',
                  borderBottomRightRadius: '5px'
                }}
              >
                <label
                  className='checkbox-btn'
                  title='released'
                  onChange={handleFiltering2}
                >
                  <input type='checkbox' />
                  <span>Released</span>
                </label>
              </div>
              {/* <div>
                <button
                  style={{ marginLeft: '250%', fontSize: '20px' }}
                  onClick={() => {
                    setDisplaying(chars)
                    close()
                  }}
                >
                  &#10006;
                </button>
              </div> */}
            </div>
            {
              //chars -> displaying
              displaying.map(character => {
                //NOTE: new version
                if (upgrade.find(u => u.id === character.id) === undefined) {
                  return (
                    <UpgradeContext.Provider
                      value={{ upgrade, setUpgrade, materials, setMaterials }}
                      key={character.id}
                    >
                      <Character key={character.id} {...character} />
                    </UpgradeContext.Provider>
                  )
                }

                //NOTE: old version
                // if (upgrade.find(u => u.name === character.name) === undefined) {
                //     return (
                //         <UpgradeContext.Provider value={{ upgrade, setUpgrade, materials, setMaterials }} key={character.name}>
                //             <Character key={character.name} {...character} />
                //         </UpgradeContext.Provider>
                //     )
                // }
                else {
                  return null
                }
              })
            }
          </div>
        )}
      </Popup>

      {/*NOTE: очистка локального хранилища*/}
      <button button onClick={clearLocStor}>
        {' '}
        Clear
      </button>

      {/*NOTE: прокачиваемые персонажи*/}
      <h2 h2> Characters</h2>
      {/* <div style={{ display: "flex", height: "50px" }}>
                <div style={{ backgroundColor: "gray", width: "fit-content" }}>
                    <button className="upgrade-filtering-rank" style={{ backgroundColor: "gray" }} onClick={handleFiltering}>
                        <div style={{ color: "#f6af5a", fontSize: "30px", textShadow: "-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black" }}>S</div>
                    </button>
                    <button className="upgrade-filtering-rank" style={{ backgroundColor: "gray" }} onClick={handleFiltering}>
                        <div style={{ color: "#b051f9", fontSize: "30px", textShadow: "-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black" }}>A</div>
                    </button>
                    <button className="upgrade-filtering-rank" style={{ backgroundColor: "gray" }} onClick={handleFiltering}>
                        <div style={{ color: "#4594df", fontSize: "30px", textShadow: "-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black" }}>B</div>
                    </button>
                </div>
                <div style={{ backgroundColor: "gray", width: "fit-content" }}>
                    <button className="upgrade-filtering-role" style={{ backgroundColor: "gray", border: "none", margin: "0px" }} onClick={handleFiltering}>
                        <img style={{ color: "#f6af5a", width: "30px" }} src="https://patchwiki.biligame.com/images/wqmt/thumb/1/1f/lpqagh7xroz987q9ucfqk83j17sk8uw.png/45px-%E7%8B%82%E6%9A%B4tj.png"
                            alt="Fury" />
                    </button>
                    <button className="upgrade-filtering-role" style={{ backgroundColor: "gray", border: "none" }} onClick={handleFiltering}>
                        <div style={{ color: "#b051f9", fontSize: "30px", textShadow: "-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black" }}>A</div>
                    </button>
                    <button className="upgrade-filtering-role" style={{ backgroundColor: "gray", border: "none" }} onClick={handleFiltering}>
                        <div style={{ color: "#4594df", fontSize: "30px", textShadow: "-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black" }}>B</div>
                    </button>
                </div>
            </div> */}
      <div div style={{ display: 'flex' }}>
        <div
          style={{
            backgroundColor: 'gray',
            width: 'fit-content',
            paddingLeft: '5px',
            paddingBottom: '5px',
            borderTopLeftRadius: '5px',
            borderBottomLeftRadius: '5px'
          }}
        >
          <label className='checkbox-btn' title='S' onChange={handleFiltering}>
            <input type='checkbox' />
            <span
              style={{
                color: '#f6af5a',
                fontSize: '30px',
                textShadow:
                  '-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black'
              }}
            >
              S
            </span>
          </label>
          <label className='checkbox-btn' title='A' onChange={handleFiltering}>
            <input type='checkbox' />
            <span
              style={{
                color: '#b051f9',
                fontSize: '30px',
                textShadow:
                  '-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black'
              }}
            >
              A
            </span>
          </label>
          <label className='checkbox-btn' title='B' onChange={handleFiltering}>
            <input type='checkbox' />
            <span
              style={{
                color: '#4594df',
                fontSize: '30px',
                textShadow:
                  '-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black'
              }}
            >
              B
            </span>
          </label>
        </div>
        <div
          style={{
            backgroundColor: 'gray',
            width: 'fit-content',
            borderTopRightRadius: '5px',
            borderBottomRightRadius: '5px'
          }}
        >
          <label
            className='checkbox-btn'
            title='Arcane'
            onChange={handleFiltering}
          >
            <input type='checkbox' />
            <span style={{ height: '30px' }}>
              <img
                style={{
                  color: '#f6af5a',
                  height: '30px',
                  textShadow:
                    '-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black'
                }}
                src='https://patchwiki.biligame.com/images/wqmt/thumb/0/04/kjdbfa801wc49rfmcfz1mhezx20vzsg.png/45px-%E5%BC%82%E8%83%BDtj.png'
                alt='Arcane'
              />
            </span>
          </label>
          <label
            className='checkbox-btn'
            title='Catalyst'
            onChange={handleFiltering}
          >
            <input type='checkbox' />
            <span style={{ height: '30px' }}>
              <img
                style={{
                  color: '#f6af5a',
                  height: '30px',
                  textShadow:
                    '-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black'
                }}
                src='https://patchwiki.biligame.com/images/wqmt/thumb/5/56/afsn6zrqt9fb5m4h71gkj4yxufw10eo.png/45px-%E5%90%AF%E8%BF%AAtj.png'
                alt='Catalyst'
              />
            </span>
          </label>
          <label
            className='checkbox-btn'
            title='Endura'
            onChange={handleFiltering}
          >
            <input type='checkbox' />
            <span style={{ height: '30px' }}>
              <img
                style={{
                  color: '#f6af5a',
                  height: '30px',
                  textShadow:
                    '-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black'
                }}
                src='https://patchwiki.biligame.com/images/wqmt/thumb/6/62/8alscnkyv5l7qwvviz86u1j4jgqzqlp.png/45px-%E5%9D%9A%E9%9F%A7tj.png'
                alt='Endura'
              />
            </span>
          </label>
          <label
            className='checkbox-btn'
            title='Fury'
            onChange={handleFiltering}
          >
            <input type='checkbox' />
            <span style={{ height: '30px' }}>
              <img
                style={{
                  color: '#f6af5a',
                  height: '30px',
                  textShadow:
                    '-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black'
                }}
                src='https://patchwiki.biligame.com/images/wqmt/thumb/1/1f/lpqagh7xroz987q9ucfqk83j17sk8uw.png/45px-%E7%8B%82%E6%9A%B4tj.png'
                alt='Fury'
              />
            </span>
          </label>
          <label
            className='checkbox-btn'
            title='Reticle'
            onChange={handleFiltering}
          >
            <input type='checkbox' />
            <span style={{ height: '30px' }}>
              <img
                style={{
                  color: '#f6af5a',
                  height: '30px',
                  textShadow:
                    '-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black'
                }}
                src='https://patchwiki.biligame.com/images/wqmt/thumb/4/49/divbvnk0fgxukcgr2cwryv3630pgoc5.png/45px-%E7%B2%BE%E5%87%86tj.png'
                alt='Reticle'
              />
            </span>
          </label>
          <label
            className='checkbox-btn'
            title='Umbra'
            onChange={handleFiltering}
          >
            <input type='checkbox' />
            <span style={{ height: '30px' }}>
              <img
                style={{
                  color: '#f6af5a',
                  height: '30px',
                  textShadow:
                    '-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black'
                }}
                src='https://patchwiki.biligame.com/images/wqmt/thumb/e/ee/otwzjaknerpqcaif3qh23vqtn7t2kzp.png/45px-%E8%AF%A1%E7%A7%98tj.png'
                alt='Umbra'
              />
            </span>
          </label>
        </div>
      </div>
      <div id='characters' style={{ marginTop: '10px' }}>
        {
          //NOTE: new version
          characters.map(character => {
            if (upgrade.find(u => u.id === character.id) !== undefined) {
              return (
                <UpgradeContext.Provider
                  value={{ materials, setMaterials, setUpgrade }}
                  key={character.id}
                >
                  <CharUpgrade
                    key={character.id}
                    {...character}
                    trigger={setOtherValue}
                  />
                </UpgradeContext.Provider>
              )
            } else {
              return null
            }
          })

          //NOTE: old version
          // upgrade.map((character) => (
          //     <UpgradeContext.Provider value={{ materials, setMaterials, setUpgrade }} key={character.name}>
          //         <CharUpgrade key={character.name} {...character} />
          //     </UpgradeContext.Provider>
          // ))
        }
      </div>

      {/*NOTE: инвентарь*/}
      {
        <h2>Inventory</h2>
        /*<div>
        <label htmlFor='needed'>
          <input
            type='checkbox'
            name=''
            id='needed'
            onChange={handleNeededChange}
          />
          Only needed materials
        </label>
        <label htmlFor='missing'>
          <input
            type='checkbox'
            name=''
            id='missing'
            onChange={handleNeededChange}
          />
          Only missing materials
        </label>
      </div> */
      }
      <h3>General</h3>
      <div id='general'>
        {
          //NOTE: materials -> materials
          materials.map(material => {
            if (material.purpose === 'general') {
              return (
                <UpgradeContext.Provider
                  value={{ setMaterials }}
                  key={material.name}
                >
                  <Material
                    key={material.name}
                    {...material}
                    ref={el => {
                      if (el) materialsRefs.current[material.name] = el
                    }}
                    trigger={setOtherValue}
                  />
                </UpgradeContext.Provider>
              )
            }
            return null
          })
        }
      </div>
      <h3>Ascension</h3>
      <div id='phaseup'>
        {
          //NOTE: materials -> materials
          materials.map(material => {
            if (material.purpose === 'phaseup') {
              return (
                <UpgradeContext.Provider
                  value={{ setMaterials }}
                  key={material.name}
                >
                  <Material
                    key={material.name}
                    {...material}
                    ref={el => {
                      if (el) materialsRefs.current[material.name] = el
                    }}
                    trigger={setOtherValue}
                  />
                </UpgradeContext.Provider>
              )
            }
            return null
          })
        }
      </div>
      <h3>Skills</h3>
      <div id='skills'>
        {
          //NOTE: materials -> materials
          materials.map(material => {
            if (material.purpose === 'skills') {
              return (
                <UpgradeContext.Provider
                  value={{ setMaterials }}
                  key={material.name}
                >
                  <Material
                    key={material.name}
                    {...material}
                    ref={el => {
                      if (el) materialsRefs.current[material.name] = el
                    }}
                    trigger={setOtherValue}
                  />
                </UpgradeContext.Provider>
              )
            }
            return null
          })
        }
      </div>
      <h3>Crimebrands</h3>
      <div id='crimebrands'>
        {materials.map(material => {
          if (material.purpose === 'crimebrand') {
            return (
              <UpgradeContext.Provider
                value={{ setMaterials }}
                key={material.name}
              >
                <Material
                  key={material.name}
                  {...material}
                  ref={el => {
                    if (el) materialsRefs.current[material.name] = el
                  }}
                  trigger={setOtherValue}
                />
              </UpgradeContext.Provider>
            )
          }
          return null
        })}
      </div>
      <h3>Chests</h3>
      <div id='chests'>
        {materials.map(material => {
          if (material.purpose === 'chest') {
            return (
              <UpgradeContext.Provider
                value={{ setMaterials }}
                key={material.name}
              >
                <Material
                  key={material.name}
                  {...material}
                  ref={el => {
                    if (el) materialsRefs.current[material.name] = el
                  }}
                  trigger={setOtherValue}
                />
              </UpgradeContext.Provider>
            )
          }
          return null
        })}
      </div>

      <div style={{ textAlign: 'center' }}>
        <p>
          This site is not affiliated with AISNO Games. All images and data
          belongs to their respective owners.
        </p>
        <p>Made by JeanneDarkAlter.</p>
      </div>
    </div>
  )
}

export default Upgrading
