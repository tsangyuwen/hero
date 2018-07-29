class BaseCharacter{
  constructor(name, hp, ap){
    this.name = name;
    this.hp = hp;
    this.ap = ap;
    this.maxHp = hp;
    this.alive = true;
  }

  attack(character, damage){
    if(character.alive == false){
      return;
    }
    character.getHurt(damage);
  }

  getHurt(damage){
    this.hp -= damage;
    if(this.hp < 1){
      this.die();
    }

    var _this = this;
    var i = 1;

    _this.id = setInterval(function(){
      if(i == 1){
        _this.element.getElementsByClassName("effect-image")[0].style.display = "block";
        _this.element.getElementsByClassName('hurt-text')[0].classList.add("attacked");
        _this.element.getElementsByClassName('hurt-text')[0].textContent = damage;
      }

      _this.element.getElementsByClassName("effect-image")[0].src = 'img/effect/blade/'+ i + '.png';
      i++;

      if(i > 8){
        _this.element.getElementsByClassName('effect-image')[0].style.display = "none";
        _this.element.getElementsByClassName('hurt-text')[0].classList.remove("attacked");
        _this.element.getElementsByClassName('hurt-text')[0].textContent = "";
        clearInterval(_this.id);
      }

    }, 50);
  }

  die(){
    this.alive = false;
  }

  updateHTML(hpElement, hurtElement){
      hpElement.textContent = this.hp;
      hurtElement.style.width = (100 - this.hp / this.maxHp * 100) + "%";
    }
}

class Hero extends BaseCharacter{
  constructor(name, hp, ap){
    super(name, hp, ap);

    this.element = document.getElementById('hero-image-block');
    this.hpElement = document.getElementById('hero-hp');
    this.maxHpElement = document.getElementById('hero-max-hp');
    this.hurtElement = document.getElementById('hero-hp-hurt');

    this.hpElement.textContent = this.hp;
    this.maxHpElement.textContent = this.maxHp;

    console.log(this.name + " hero create successed");
  }

  attack(character){
    var damage = Math.random() * (this.ap / 2) + (this.ap / 2);
    super.attack(character, Math.floor(damage));
  }

  getHeal(){
    var _this = this;
    var i = 1;

    _this.id = setInterval(function(){
      if(i == 1){
        _this.element.getElementsByClassName("effect-image")[0].style.display = "block";
        _this.element.getElementsByClassName('hurt-text')[0].classList.add("healed");
        _this.element.getElementsByClassName('hurt-text')[0].textContent = 30;
      }

      _this.element.getElementsByClassName("effect-image")[0].src = 'img/effect/heal/'+ i + '.png';
      i++;

      if(i > 8){
        _this.element.getElementsByClassName('effect-image')[0].style.display = "none";
        _this.element.getElementsByClassName('hurt-text')[0].classList.remove("healed");
        _this.element.getElementsByClassName('hurt-text')[0].textContent = "";
        clearInterval(_this.id);
      }


    }, 50);

    if(this.hp + 30 > this.maxHp){
      this.hp = this.maxHp;
    }else{
      this.hp += 30;
    }
    this.updateHTML(this.hpElement, this.hurtElement);
  }

  getHurt(damage){
    super.getHurt(damage);
    this.updateHTML(this.hpElement, this.hurtElement);
  }
}

class Monster extends BaseCharacter{
  constructor(name, hp, ap){ 
    super(name, hp, ap);

    this.element = document.getElementById('monster-image-block');
    this.hpElement = document.getElementById('monster-hp');
    this.maxHpElement = document.getElementById('monster-max-hp');
    this.hurtElement = document.getElementById('monster-hp-hurt');

    this.hpElement.textContent = this.hp;
    this.maxHpElement.textContent = this.maxHp;

    console.log(this.name + " monster create successed");
  }

  attack(character){
    var damage = Math.random() * (this.ap / 2) + (this.ap / 2);
    super.attack(character, Math.floor(damage));
  }

  getHurt(damage){
    super.getHurt(damage);
    this.updateHTML(this.hpElement, this.hurtElement);
  }
}

var hero = new Hero("Bernard", 130, 20);
var monster = new Monster("Skeleton", 130, 10);

function heroAttack(){
  document.getElementsByClassName('skill-block')[0].style.display = 'none';

  setTimeout(function(){
    hero.element.classList.add("attacking");

    setTimeout(function(){
      hero.attack(monster);
      hero.element.classList.remove("attacking");
    }, 500);
  }, 100);

  setTimeout(function(){
    if(monster.alive){
      monster.element.classList.add("attacking");

      setTimeout(function(){
        monster.attack(hero);
        monster.element.classList.remove("attacking");
        endTurn();
        if(hero.alive == false){
          finish();
        }else{
          document.getElementsByClassName('skill-block')[0].style.display = "block";
        }
      }, 500);
    }else{
      finish();
    }
    
  }, 1100);
}

var key;
document.onkeypress = function(e){
  e = e || window.event;
  key = e.keyCode || e.which;

  if(key == 97){
    heroAttack();
  }

  if(key == 100){
    hero.getHeal();
  }
}

function addSkillEvent(){
  var skill = document.getElementById('skill');
  skill.onclick = function(){
    heroAttack();
  }
}
addSkillEvent();

function addHealEvent(){
  var heal = document.getElementById('heal');
  heal.onclick = function(){
    hero.getHeal();
  }
}
addHealEvent();


var rounds = 10;
function endTurn(){
  rounds--;
  document.getElementById('round-num').textContent = rounds;
  if(rounds < 1){
    finish();
  }
}

function finish(){
  var dialog = document.getElementById("dialog");
  dialog.style.display = "block";
  if(monster.alive == false){
    dialog.classList.add("win");
  }else{
    dialog.classList.add("lose");
  }
}