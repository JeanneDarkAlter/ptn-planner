import Popup from 'reactjs-popup'
import '../css/Character.css'
import { useContext, useState } from 'react'
import { UpgradeContext } from './Upgrading'
import { Upgrade } from './Upgrade'

function Character ({ ...character }) {
  const [charData, setCharData] = useState({
    currPhase: 0,
    goalPhase: 0,
    currSkill1: 1,
    goalSkill1: 1,
    currSkill2: 1,
    goalSkill2: 1,
    currSkill3: 1,
    goalSkill3: 1,
    currSkill4: 1,
    goalSkill4: 1,
    currECB: 0,
    goalECB: 0
  })

  const upgrade = useContext(UpgradeContext).upgrade
  const setUpgrade = useContext(UpgradeContext).setUpgrade
  const materials = useContext(UpgradeContext).materials
  const setMaterials = useContext(UpgradeContext).setMaterials

  //NOTE: изменения в форме
  const handleChanges = event => {
    setCharData(prevState => {
      let sub = ''
      if (event.target.name.includes('curr')) {
        sub = document.getElementById(event.target.name.replace('curr', 'goal'))
      } else if (event.target.name.includes('goal')) {
        sub = document.getElementById(event.target.name.replace('goal', 'curr'))
      }
      return {
        ...prevState,
        [event.target.name]: event.target.value,
        [sub.name]: sub.value
      }
    })
  }

  //NOTE: валидация input'ов
  const handleInputValidation1 = event => {
    let goal = 'goalSkill' + event.target.id.charAt(event.target.id.length - 1)
    let goalEl = document.getElementById(goal)
    if (parseInt(event.target.value) >= parseInt(event.target.max)) {
      event.target.value = event.target.max
      goalEl.value = event.target.max
    }
    if (parseInt(event.target.value) < parseInt(event.target.min)) {
      event.target.value = event.target.min
    }
    if (parseInt(event.target.value) > parseInt(goalEl.value)) {
      goalEl.value = event.target.value
    }
    if (event.target.value === '') {
      event.target.value = event.target.min
    }
  }

  const handleInputValidation2 = event => {
    let current =
      'currSkill' + event.target.id.charAt(event.target.id.length - 1)
    let currentEl = document.getElementById(current)
    if (parseInt(event.target.value) > parseInt(event.target.max)) {
      event.target.value = event.target.max
    }
    if (parseInt(event.target.value) < parseInt(currentEl.value)) {
      currentEl.value = event.target.value
    }
    if (parseInt(event.target.value) < parseInt(event.target.min)) {
      event.target.value = event.target.min
      currentEl.value = event.target.min
    }
  }

  //NOTE: валидация списков
  const handleSelectValidation1 = event => {
    let goalEl = document.getElementById(
      event.target.name.replace('curr', 'goal')
    )
    if (parseInt(event.target.value) > parseInt(goalEl.value)) {
      goalEl.value = event.target.value
    }
  }

  const handleSelectValidation2 = event => {
    let currentEl = document.getElementById(
      event.target.name.replace('goal', 'curr')
    )
    if (parseInt(event.target.value) < parseInt(currentEl.value)) {
      currentEl.value = event.target.value
    }
  }

  //NOTE: две функции
  const twoFunctions = event => {
    handleChanges(event)
    if (event.target.name.includes('currSkill')) {
      handleInputValidation1(event)
    } else if (event.target.name.includes('goalSkill')) {
      handleInputValidation2(event)
    } else if (
      event.target.name.includes('currPhase') ||
      event.target.name.includes('currECB')
    ) {
      handleSelectValidation1(event)
    } else if (
      event.target.name.includes('goalPhase') ||
      event.target.name.includes('goalECB')
    ) {
      handleSelectValidation2(event)
    }
  }

  //NOTE: функция добавления персонажа
  const addChar = () => {
    //NOTE: old version
    // character.currPhase = charData.currPhase;
    // character.goalPhase = charData.goalPhase;
    // character.currSkill1 = charData.currSkill1;
    // character.currSkill2 = charData.currSkill2;
    // character.currSkill3 = charData.currSkill3;
    // character.currSkill4 = charData.currSkill4;
    // character.goalSkill1 = charData.goalSkill1;
    // character.goalSkill2 = charData.goalSkill2;
    // character.goalSkill3 = charData.goalSkill3;
    // character.goalSkill4 = charData.goalSkill4;

    //NOTE: new version
    let char = new Upgrade(
      character.id,
      charData.currPhase,
      charData.goalPhase,
      charData.currSkill1,
      charData.goalSkill1,
      charData.currSkill2,
      charData.goalSkill2,
      charData.currSkill3,
      charData.goalSkill3,
      charData.currSkill4,
      charData.goalSkill4,
      charData.currECB,
      charData.goalECB
    )

    localStorage.setItem('upgrade', JSON.stringify([...upgrade, char]))
    setUpgrade([...upgrade, char])

    //NOTE: old version
    // localStorage.setItem("upgrade", JSON.stringify([...upgrade, character]));
    // setUpgrade([...upgrade, character]);

    for (
      let i = parseInt(charData.currPhase);
      i < parseInt(charData.goalPhase);
      i++
    ) {
      for (let j = 0; j < character.phases[i].length; j++) {
        let material = materials.find(m => m.name === character.phases[i][j][0])
        material.needed += character.phases[i][j][1]

        const index = material.characters.findIndex(
          char => char.name === character.name
        )
        if (index !== -1) {
          material.characters[index].amount += character.phases[i][j][1]
        } else {
          material.characters.push({
            name: character.name,
            amount: character.phases[i][j][1]
          })
        }
      }
    }
    for (
      let i = parseInt(charData.currSkill1);
      i < parseInt(charData.goalSkill1);
      i++
    ) {
      for (let j = 0; j < character.skills[i - 1].length; j++) {
        let material = materials.find(
          m => m.name === character.skills[i - 1][j][0]
        )
        material.needed += character.skills[i - 1][j][1]

        const index = material.characters.findIndex(
          char => char.name === character.name
        )
        if (index !== -1) {
          material.characters[index].amount += character.skills[i - 1][j][1]
        } else {
          material.characters.push({
            name: character.name,
            amount: character.skills[i - 1][j][1]
          })
        }
      }
    }
    for (
      let i = parseInt(charData.currSkill2);
      i < parseInt(charData.goalSkill2);
      i++
    ) {
      for (let j = 0; j < character.skills[i - 1].length; j++) {
        let material = materials.find(
          m => m.name === character.skills[i - 1][j][0]
        )
        material.needed += character.skills[i - 1][j][1]

        const index = material.characters.findIndex(
          char => char.name === character.name
        )
        if (index !== -1) {
          material.characters[index].amount += character.skills[i - 1][j][1]
        } else {
          material.characters.push({
            name: character.name,
            amount: character.skills[i - 1][j][1]
          })
        }
      }
    }
    for (
      let i = parseInt(charData.currSkill3);
      i < parseInt(charData.goalSkill3);
      i++
    ) {
      for (let j = 0; j < character.skills[i - 1].length; j++) {
        let material = materials.find(
          m => m.name === character.skills[i - 1][j][0]
        )
        material.needed += character.skills[i - 1][j][1]

        const index = material.characters.findIndex(
          char => char.name === character.name
        )
        if (index !== -1) {
          material.characters[index].amount += character.skills[i - 1][j][1]
        } else {
          material.characters.push({
            name: character.name,
            amount: character.skills[i - 1][j][1]
          })
        }
      }
    }
    for (
      let i = parseInt(charData.currSkill4);
      i < parseInt(charData.goalSkill4);
      i++
    ) {
      for (let j = 0; j < character.skills[i - 1].length; j++) {
        let material = materials.find(
          m => m.name === character.skills[i - 1][j][0]
        )
        material.needed += character.skills[i - 1][j][1]

        const index = material.characters.findIndex(
          char => char.name === character.name
        )
        if (index !== -1) {
          material.characters[index].amount += character.skills[i - 1][j][1]
        } else {
          material.characters.push({
            name: character.name,
            amount: character.skills[i - 1][j][1]
          })
        }
      }
    }
    for (
      let i = parseInt(charData.currECB);
      i < parseInt(charData.goalECB);
      i++
    ) {
      for (let j = 0; j < character.ecb[i].length; j++) {
        let material = materials.find(m => m.name === character.ecb[i][j][0])
        material.needed += character.ecb[i][j][1]

        const index = material.characters.findIndex(
          char => char.name === character.name
        )
        if (index !== -1) {
          material.characters[index].amount += character.ecb[i][j][1]
        } else {
          material.characters.push({
            name: character.name,
            amount: character.ecb[i][j][1]
          })
        }
      }
    }

    localStorage.setItem('materials', JSON.stringify(materials))
    setMaterials(materials)
  }

  return (
    <Popup
      trigger={
        <button
          id={character.name}
          style={{
            background:
              character.rank === 'S'
                ? 'linear-gradient(black, #f6af5a)'
                : character.rank === 'A'
                ? 'linear-gradient(black, #b051f9)'
                : 'linear-gradient(black, #4594df)'
          }}
        >
          <div height={150} style={{ display: 'block' }}>
            <img src={character.img} alt='' height={100} />
            <p style={{ margin: 0 }}>{character.name}</p>
          </div>
        </button>
      }
      modal
      nested
      position='center center'
    >
      {close => (
        <div className='character'>
          <div>
            <img src={character.img} alt='' height={220} />
          </div>
          {/* <div class="tab">
                            <button onClick={() => setActiveTab(1)}>Skills</button>
                            <button onClick={() => setActiveTab(2)}>Crimebrands</button>
                        </div> */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <fieldset>
              <legend>
                <strong>Ascension & Skills</strong>
              </legend>
              <p>
                <label htmlFor='currPhase'>Current Phase: </label>
                <select id='currPhase' name='currPhase' onChange={twoFunctions}>
                  <option value='0'>1 &#x25C7; &#x25C7; &#x25C7;</option>
                  <option value='1'>20 &#x25C7; &#x25C7; &#x25C7;</option>
                  <option value='2'>20 &#x25C6; &#x25C7; &#x25C7;</option>
                  <option value='3'>40 &#x25C6; &#x25C7; &#x25C7;</option>
                  <option value='4'>40 &#x25C6; &#x25C6; &#x25C7;</option>
                  <option value='5'>70 &#x25C6; &#x25C6; &#x25C7;</option>
                  <option value='6'>70 &#x25C6; &#x25C6; &#x25C6;</option>
                  <option value='7'>80 &#x25C6; &#x25C6; &#x25C6;</option>
                  <option value='8'>85 &#x25C6; &#x25C6; &#x25C6;</option>
                  <option value='9'>90 &#x25C6; &#x25C6; &#x25C6;</option>
                  {/* <option value="0">
                                        &#x25C7;
                                        &#x25C7;
                                        &#x25C7;
                                    </option>
                                    <option value="1">
                                        &#x25C6;
                                        &#x25C7;
                                        &#x25C7;
                                    </option>
                                    <option value="2">
                                        &#x25C6;
                                        &#x25C6;
                                        &#x25C7;
                                    </option>
                                    <option value="3">
                                        &#x25C6;
                                        &#x25C6;
                                        &#x25C6;
                                    </option> */}
                </select>
              </p>
              <p>
                <label htmlFor='goalPhase'>Goal Phase: </label>
                <select id='goalPhase' name='goalPhase' onChange={twoFunctions}>
                  <option value='0'>1 &#x25C7; &#x25C7; &#x25C7;</option>
                  <option value='1'>20 &#x25C7; &#x25C7; &#x25C7;</option>
                  <option value='2'>20 &#x25C6; &#x25C7; &#x25C7;</option>
                  <option value='3'>40 &#x25C6; &#x25C7; &#x25C7;</option>
                  <option value='4'>40 &#x25C6; &#x25C6; &#x25C7;</option>
                  <option value='5'>70 &#x25C6; &#x25C6; &#x25C7;</option>
                  <option value='6'>70 &#x25C6; &#x25C6; &#x25C6;</option>
                  <option value='7'>80 &#x25C6; &#x25C6; &#x25C6;</option>
                  <option value='8'>85 &#x25C6; &#x25C6; &#x25C6;</option>
                  <option value='9'>90 &#x25C6; &#x25C6; &#x25C6;</option>
                  {/* <option value="0">
                                        &#x25C7;
                                        &#x25C7;
                                        &#x25C7;
                                    </option>
                                    <option value="1">
                                        &#x25C6;
                                        &#x25C7;
                                        &#x25C7;
                                    </option>
                                    <option value="2">
                                        &#x25C6;
                                        &#x25C6;
                                        &#x25C7;
                                    </option>
                                    <option value="3">
                                        &#x25C6;
                                        &#x25C6;
                                        &#x25C6;
                                    </option> */}
                </select>
              </p>

              <div className='skills'>
                <div>
                  <p>
                    <strong>Normal ATK</strong>
                  </p>
                  <p>
                    <label htmlFor='currSkill1'>
                      Current LVL:{' '}
                      <input
                        type='number'
                        name='currSkill1'
                        id='currSkill1'
                        min='1'
                        max='10'
                        onChange={twoFunctions}
                        defaultValue={1}
                      />
                    </label>
                  </p>
                  <p>
                    <label htmlFor='goalSkill1'>
                      Goal LVL:{' '}
                      <input
                        type='number'
                        name='goalSkill1'
                        id='goalSkill1'
                        min='1'
                        max='10'
                        onChange={twoFunctions}
                        defaultValue={1}
                      />
                    </label>
                  </p>

                  <p>
                    <strong>Passive 1</strong>
                  </p>
                  <p>
                    <label htmlFor='currSkill3'>
                      Current LVL:{' '}
                      <input
                        type='number'
                        name='currSkill3'
                        id='currSkill3'
                        min='1'
                        max='10'
                        onChange={twoFunctions}
                        defaultValue={1}
                      />
                    </label>
                  </p>
                  <p>
                    <label htmlFor='goalSkill3'>
                      Goal LVL:{' '}
                      <input
                        type='number'
                        name='goalSkill3'
                        id='goalSkill3'
                        min='1'
                        max='10'
                        onChange={twoFunctions}
                        defaultValue={1}
                      />
                    </label>
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Ultimate</strong>
                  </p>
                  <p>
                    <label htmlFor='currSkill2'>
                      Current LVL:{' '}
                      <input
                        type='number'
                        name='currSkill2'
                        id='currSkill2'
                        min='1'
                        max='10'
                        onChange={twoFunctions}
                        defaultValue={1}
                      />
                    </label>
                  </p>
                  <p>
                    <label htmlFor='goalSkill2'>
                      Goal LVL:{' '}
                      <input
                        type='number'
                        name='goalSkill2'
                        id='goalSkill2'
                        min='1'
                        max='10'
                        onChange={twoFunctions}
                        defaultValue={1}
                      />
                    </label>
                  </p>

                  <p>
                    <strong>Passive 2</strong>
                  </p>
                  <p>
                    <label htmlFor='currSkill4'>
                      Current LVL:{' '}
                      <input
                        type='number'
                        name='currSkill4'
                        id='currSkill4'
                        min='1'
                        max='10'
                        onChange={twoFunctions}
                        defaultValue={1}
                      />
                    </label>
                  </p>
                  <p>
                    <label htmlFor='goalSkill4'>
                      Goal LVL:{' '}
                      <input
                        type='number'
                        name='goalSkill4'
                        id='goalSkill4'
                        min='1'
                        max='10'
                        onChange={twoFunctions}
                        defaultValue={1}
                      />
                    </label>
                  </p>
                </div>
              </div>
            </fieldset>
            <fieldset>
              <legend>
                <strong>Crimebrands</strong>
              </legend>
              <p>
                <label htmlFor='currECB'>Current ECB LVL: </label>
                <select id='currECB' name='currECB' onChange={twoFunctions}>
                  <option value='0'>Locked</option>
                  <option value='1'>1</option>
                  <option value='2'>2</option>
                  <option value='3'>3</option>
                </select>
              </p>
              <p>
                <label htmlFor='goalECB'>Goal ECB LVL: </label>
                <select id='goalECB' name='goalECB' onChange={twoFunctions}>
                  <option value='0'>Still Locked</option>
                  <option value='1'>1</option>
                  <option value='2'>2</option>
                  <option value='3'>3</option>
                </select>
              </p>
            </fieldset>
          </div>
          <input type='button' value='Add character' onClick={addChar} />
          <button onClick={() => close()}>Close</button>
        </div>
      )}
    </Popup>
  )
}
export default Character
