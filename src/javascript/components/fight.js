import { controls } from '../../constants/controls';

export async function fight(firstFighter, secondFighter) {
  return new Promise((resolve) => {
    let firstFighterAttacked = false;
    let secondFighterAttacked = false;
    let firstFighterInBlock = false;
    let secondFighterInBlock = false;
    let firstFighterHP = secondFighter.health;
    let secondFighterHP = secondFighter.health;
    let PlayerOneCriticalHit = false;
    let PlayerTwoCriticalHit = false;

    const healthIndicator = document.getElementsByClassName('arena___health-bar');
    let maxHpFirstFighter = firstFighter.health;
    let maxHpSecondFighter = secondFighter.health;
    let hpFirstFighterRemains;
    let hpSecondFighterRemains;
    window.addEventListener('keyup', function () {
      switch (event.code) {
        case controls.PlayerOneAttack:
          firstFighterAttacked = false;
          break

        case controls.PlayerTwoAttack:
          secondFighterAttacked = false;
          break

        case controls.PlayerOneBlock:
          firstFighterInBlock = false;
          break

        case controls.PlayerTwoBlock:
          secondFighterInBlock = false;
          break
      }
    })

    window.addEventListener("keydown", function () {
      switch (this.event.code) {
        case controls.PlayerOneAttack:
          if (!firstFighterAttacked) {
            if (secondFighterInBlock) {
              break;
            }
            const firstFighterDamage = getDamage(firstFighter, secondFighter);
            firstFighterAttacked = true;
            if (firstFighterDamage > 0) {
              secondFighterHP -= firstFighterDamage;
              hpSecondFighterRemains = (secondFighterHP / maxHpSecondFighter) * 100;
              healthIndicator[1].style.width = `${hpSecondFighterRemains}%`
            }
          }
          break

        case controls.PlayerOneBlock:
          firstFighterInBlock = true;
          break

        case controls.PlayerTwoAttack:
          if (!secondFighterAttacked) {
            if (firstFighterInBlock) {
              break
            }
            const secondFighterDamage = getDamage(secondFighter, firstFighter);
            hpFirstFighterRemains = (firstFighterHP / maxHpFirstFighter) * 100;
            healthIndicator[0].style.width = `${hpFirstFighterRemains}%`
            secondFighterAttacked = true;
            if (secondFighterDamage > 0) {
              firstFighterHP -= secondFighterDamage;
            }
          }
          break

        case controls.PlayerTwoBlock:
          secondFighterInBlock = true;
          break

        case (controls.PlayerOneCriticalHitCombination[0] && controls.PlayerOneCriticalHitCombination[1] && controls.PlayerOneCriticalHitCombination[2]):
          if (!PlayerOneCriticalHit) {
            if (secondFighterInBlock) {
              break;
            }
            const firstFighterCriticalDamage = 2 * firstFighter.attack;
            secondFighterHP -= firstFighterCriticalDamage;
            hpSecondFighterRemains = (secondFighterHP / maxHpSecondFighter) * 100;
            healthIndicator[1].style.width = `${hpSecondFighterRemains}%`
            PlayerOneCriticalHit = true
            setTimeout(function () {
              PlayerOneCriticalHit = false;
            }, 10000)
          }
          break;

        case (controls.PlayerTwoCriticalHitCombination[0] && controls.PlayerTwoCriticalHitCombination[1] && controls.PlayerTwoCriticalHitCombination[2]):
          if (!PlayerTwoCriticalHit) {
            if (firstFighterInBlock) {
              return;
            }
            const secondFighterCriticalDamage = 2 * secondFighter.attack;
            firstFighterHP -= secondFighterCriticalDamage;
            hpFirstFighterRemains = (firstFighterHP / maxHpFirstFighter) * 100;
            healthIndicator[0].style.width = `${hpFirstFighterRemains}%`
            PlayerTwoCriticalHit = true
            setTimeout(function () {
              PlayerTwoCriticalHit = false;
            }, 10000)
          }
          break
      }

      if (secondFighterHP <= 0) {
        resolve(firstFighter);
      }
      if (firstFighterHP <= 0) {
        resolve(secondFighter);
      }
    })
    // resolve the promise with the winner when fight is over
  })
}

export function getDamage(attacker, defender) {
  const damage = getHitPower(attacker) - getBlockPower(defender);
  return damage > 0 ? damage : 0;
  // return damage
}

export function getHitPower(fighter) {
  const criticalHitChance = Math.random() + 1;
  return fighter.attack * criticalHitChance;
  // return hit power
}

export function getBlockPower(fighter) {
  const dodgeChance = Math.random() + 1;
  return fighter.defense * dodgeChance;
  // return block power
}
