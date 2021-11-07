let crew = [];

// Crew Creation
const addNewCrewMember = () => {
    let newCrewMember = document.getElementById('new_crew_member').value;

    if (newCrewMember !== '' && newCrewMember.length <= 35) {
        if (crew.length < 5) {
            crew.push(newCrewMember);
            appendNewCrewMember(newCrewMember);
            document.getElementById('new_crew_member').value = '';
        } else {
            alert('Crew can not exceed 5 players...');
        }
    } else {
        alert('Crew member\'s name must have a value and not be longer than 35 characters!')
    }
}

const appendNewCrewMember = (crewMember) => {
    let crewMembersList = document.getElementById('crew_members');
    let markup = `
        <li class="list-group-item crew_member">
            <i class="fas fa-user-astronaut me-2"></i>
            ${crewMember}
            <button type="button" class="btn btn-danger ms-auto" onclick="removeNewCrewMember(this)">
                <i class="fas fa-trash"></i>
            </button>
        </li>
    `;
    crewMembersList.insertAdjacentHTML('beforeend', markup);
}

const removeNewCrewMember = (btnEl) => {
    let crewMember = btnEl.parentElement.innerText;
    crew = crew.filter(crewMbr => crewMbr !== crewMember);
    btnEl.parentElement.remove();
}

const saveNewCrew = () => {
    let lastCrewID = getLastCrewId();
    let crewData = getStorageItem('crews');

    if (crewData !== null) {
        crewData = JSON.parse(crewData);

        crewData.push({
            id: lastCrewID,
            crew: crew
        });

        setStorageItem('crews', crewData);
    } else {
        setStorageItem('crews', [{ id: lastCrewID, crew: crew }]);
    }

    alert(`New crew created. ID: ${lastCrewID} | Crew Members: ${crew.join(', ')}`);

    crew = [];
    document.getElementById('crew_members').innerHTML = '';
}


// Selecting existing crew
const fetchExistingCrews = () => {
    let crews = getStorageItem('crews');
    document.getElementById('crews').innerHTML = '';

    if (crews !== null) {
        crews = JSON.parse(crews);

        crews.forEach((el) => {
            appendCrew(el);
        })
    }
}

const appendCrew = (crew) => {
    let crewList = document.getElementById('crews');
    let crewMembers = crew.crew.map(el => `<li>${el}</li>`);
    let markup = `
        <li class="list-group-item crew_member align-items-center">
            <div class="d-flex flex-column justify-content-center">
                <div>
                    <i class="fas fa-user-astronaut me-2"></i>
                    ID: ${crew.id}
                </div>
                <div>
                    Crew Members:
                    <ul>
                        ${crewMembers.join('')}
                    </ul>
                </div>
            </div>
            <button type="button" class="btn btn-success ms-auto" onclick="setActiveCrew(${crew.id})">
                <i class="far fa-check-square"></i>
            </button>
            <button type="button" class="btn btn-danger ms-1" onclick="removeCrew(${crew.id})">
                <i class="fas fa-trash"></i>
            </button>
        </li>
    `;

    crewList.insertAdjacentHTML('beforeend', markup);
}

const setActiveCrew = (crewID) => {
    setStorageItem('active_crew', crewID);
    alert(`Crew ${crewID} now set as active crew`);
}

const removeCrew = (crewID) => {
    let crews = getStorageItem('crews');

    if (crews !== null) {
        crews = JSON.parse(crews);
        setStorageItem('crews', crews.filter(el => el.id !== crewID));
        fetchExistingCrews();
        alert(`Crew ${crewID} removed. Mankind thanks you for your service!`)
    }
}

// LocalStorage Logic
const getStorageItem = (key) => {
    return localStorage.getItem(key);
}

const setStorageItem = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
}

const getLastCrewId = () => {
    let crews = getStorageItem('crews')
    if (crews !== null) {
        let lastID = 0;
        crews = JSON.parse(crews);

        crews.forEach((el) => {
            if (parseInt(el.id) > lastID) {
                lastID = parseInt(el.id)
            }
        })

        return lastID + 1
    } else {
        return 1;
    }
}