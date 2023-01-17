async function getAllUsers() {
    const response = await fetch('http://localhost:7777/admin/api/v1/users');
    const users = await response.json();

    users.forEach(user => printAllUsers(user));

}

async function getAllRoles() {
    const response = await fetch('http://localhost:7777/admin/api/v1/users/roles');
    const roles = await response.json();

    jQuery('option').remove();
    roles.forEach(role => printRoles(role));
    return roles;
}

async function deleteUser(id) {
    const response = await fetch(`http://localhost:7777/admin/api/v1/users/${id}`,
        {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'}
        });
    const data = await response.json();

    if (data) {
        document.getElementById(`user${id}`).remove();
    }
}

document.getElementById('addNewUserBtn').addEventListener('click', async (e) => {
    e.preventDefault();
    const firstName = jQuery(`#newFirstName`).val();
    const lastName = jQuery(`#newLastName`).val();
    const email = jQuery(`#newEmail`).val();
    const age = jQuery(`#newAge`).val();
    const username = jQuery(`#newUsername`).val();
    const password = jQuery(`#newPassword`).val();
    const roleId = jQuery(`#newUserRoles`).val();
    const roleName = jQuery(`#newUserRoles option:selected`).attr('label');

    let rolesNew = {
        id: roleId,
        name: roleName
    };

    let roles = [rolesNew];

    const response = await fetch(`http://localhost:7777/admin/api/v1/users`,
        {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({firstName, lastName, email, age, username, password, roles})
        });

    const result = await response.json();
    printAllUsers(result);
    await getAllRoles();
    jQuery('#newUserForm')[0].reset();
    jQuery('#action li:first-child a').tab('show');

});

async function updateUser(id) {
    const firstName = jQuery(`#firstName${id}`).val();
    const lastName = jQuery(`#lastName${id}`).val();
    const email = jQuery(`#email${id}`).val();
    const age = jQuery(`#age${id}`).val();
    const username = jQuery(`#username${id}`).val();
    const roleId = jQuery(`#roles${id}`).val();
    const roleName = jQuery(`#roles${id} option:selected`).attr('label');

    let rolesNew = {
        id: roleId,
        name: roleName
    };

    let roles = [rolesNew];

    const response = await fetch(`http://localhost:7777/admin/api/v1/users/${id}`,
        {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({firstName, lastName, email, age, username, roles})
        });
    const result = await response.json();

    if (result) {

        let roleList = '';
        for (let i = 0; i < result.roles.length; i++) {
            let arr = result.roles[i].name.split("_");
            roleList += arr[1];
            if (i < result.roles.length - 1) {
                roleList += ',';
            }
        }

        jQuery(`#user${id}`).replaceWith(`

                    <tr id="user${id}">
                        <td className="align-middle">${result.id}</td>
                        <td className="align-middle">${result.firstName}</td>
                        <td className="align-middle">${result.lastName}</td>
                        <td className="align-middle">${result.email}</td>
                        <td className="align-middle">${result.age}"</td>
                        <td className="align-middle">${roleList}</td>
                        <td>

                            <button type="button" class="btn btn-primary mx-1" data-bs-toggle="modal" data-bs-target="#userEdit${id}" id="edit">Edit</button>
                                    <!--Модальное окно изменение данных пользователя-->
                                    <div class="modal fade" id="userEdit${id}" tabindex="-1" aria-labelledby="exampleModalLabel1" aria-hidden="true">
                                        <div class="modal-dialog">
                                            <div class="modal-content">
                                                <div class="modal-header">
                                                    <h1 class="modal-title fs-5" id="exampleModalLabel1">Edit user</h1>
                                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Закрыть"></button>
                                                </div>

                                                <div class="modal-body text-center">
                                                    <label for="id1">ID</label>
                                                    <input class="form-control bg-light" type="text" value="${id}" readonly="readonly" id="id${id}"><br>
                                                    <label for="firstName1">First Name</label>
                                                    <input class="firstNameInput form-control bg-light" type="text" value="${firstName}" id="firstName${id}" name="firstName1"required><br>
                                                    <label for="lastName1">Last Name</label>
                                                    <input class="lastNameInput form-control bg-light" type="text" value="${lastName}" id="lastName${id}" name="lastName1" required><br>
                                                    <label for="email1" >Email</label>
                                                    <input class="enailInput form-control bg-light" type="text" value="${email}" id="email${id}" name="email1" required><br>
                                                    <label for="age1" >Age</label>
                                                    <input class="ageInput form-control bg-light" type="number" value="${age}" id="age${id}" name="age1" required><br>
                                                    <label for="username1">Username</label>
                                                    <input class="usernameInput form-control bg-light" type="text" value="${username}" id="username${id}" name="username1" required><br>
                                                    <p>
                                                    <label for="roles1">Role</label>
                                                    <select class="editRoles form-control" id="roles${id}" name="roles${id}" value="${roles}">

                                                    </select>
                                                    </p>
                                                </div>
                                                <div class="modal-footer">
                                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                                    <button onclick="updateUser(${id}); return false;" type="submit" class="editBtn btn btn-primary mx-1"  data-bs-dismiss="modal" >Edit</button>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td class="align-middle d-flex">
                                    <button type="button" class="btn btn-danger mx-1" data-bs-toggle="modal" data-bs-target="#userDelet${id}" >Delete</button>
                                    <!--Модальное окно удаление пользователя-->
                                    <div class="modal fade" id="userDelet${id}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                        <div class="modal-dialog">
                                            <div class="modal-content">
                                                <div class="modal-header">
                                                    <h1 class="modal-title fs-5" id="exampleModalLabel">Delete user</h1>
                                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Закрыть"></button>
                                                </div>
                                                <div class="modal-body text-center">
                                                    <label for="id">ID</label>
                                                    <input class="form-control bg-light" type="text" placeholder="${id}" readonly="readonly" id="id"><br>
                                                    <label for="firstName">First Name</label>
                                                    <input class="form-control bg-light" type="text" placeholder="${firstName}" readonly="readonly" id="firstName"><br>
                                                    <label for="lastName">Last Name</label>
                                                    <input class="form-control bg-light" type="text" placeholder="${lastName}" readonly="readonly" id="lastName"><br>
                                                    <label for="email" >Email</label>
                                                    <input class="form-control bg-light" type="email" placeholder="${email}" readonly="readonly" id="email"><br>
                                                    <label for="age" >Age</label>
                                                    <input class="form-control bg-light" type="text" placeholder="${age}" readonly="readonly" id="age"><br>
                                                    <label for="roles" >Role</label>
                                                    <div class="form-control bg-light" id="roles">${roleList}</div>
                                                </div>
                                                <div class="modal-footer">
                                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                                    <button  type="button" onclick="deleteUser(${id}); return false;" class="btn btn-danger mx-1" id="deleteBtn" data-bs-dismiss="modal">Delete</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </td>

                    </tr>`);
        await getAllRoles();
    }
}

function printRoles({id, name}) {
    const optionsOfRoles = document.getElementsByClassName('editRoles');

    for (let i = 0; i < optionsOfRoles.length; i++) {
        optionsOfRoles[i].insertAdjacentHTML('beforeend', `
             <option value="${id}" label="${name}"></option>
            `)
    }
}

function printAllUsers({id, firstName, lastName, email, age, username, roles}) {
    const userList = document.getElementById('userList');

    let roleList = '';
    for (let i = 0; i < roles.length; i++) {
        let arr = roles[i].name.split("_");
        roleList += arr[1];
        if (i < roles.length - 1) {
            roleList += ',';
        }
    }

    userList.insertAdjacentHTML("beforeend", `

        <tr id="user${id}" xmlns="http://www.w3.org/1999/html">
            <td className="align-middle">${id}</td>
            <td className="align-middle">${firstName}</td>
            <td className="align-middle">${lastName}</td>
            <td className="align-middle">${email}</td>
            <td className="align-middle">${age}"</td>
            <td className="align-middle">${roleList}</td>
            <td>
                 <button type="button" class="btn btn-primary mx-1" data-bs-toggle="modal" data-bs-target="#userEdit${id}" id="edit">Edit</button>
                    <!--Модальное окно изменение данных пользователя-->
                        <div class="modal fade" id="userEdit${id}" tabindex="-1" aria-labelledby="exampleModalLabel1" aria-hidden="true">
                                        <div class="modal-dialog">
                                            <div class="modal-content">
                                                <div class="modal-header">
                                                    <h1 class="modal-title fs-5" id="exampleModalLabel1">Edit user</h1>
                                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Закрыть"></button>
                                                </div>
                                                 <form class="form-signin">
                                                <div class="modal-body text-center">
                                                   
                                                    <label for="id1">ID</label>
                                                    <input class="form-control bg-light" type="text" value="${id}" readonly="readonly" id="id${id}"><br>
                                                    <label for="firstName1">First Name</label>
                                                    <input class="firstNameInput form-control bg-light" type="text" value="${firstName}" id="firstName${id}" name="firstName1"required><br>
                                                    <label for="lastName1">Last Name</label>
                                                    <input class="lastNameInput form-control bg-light" type="text" value="${lastName}" id="lastName${id}" name="lastName1" required><br>
                                                    <label for="email1" >Email</label>
                                                    <input class="enailInput form-control bg-light" type="email" value="${email}" id="email${id}" name="email1" required><br>
                                                    <label for="age1" >Age</label>
                                                    <input class="ageInput form-control bg-light" type="number" value="${age}" id="age${id}" name="age1" required><br>
                                                    <label for="username1">Username</label>
                                                    <input class="usernameInput form-control bg-light" type="text" value="${username}" id="username${id}" name="username1" required><br>
                                                    <p>
                                                    <label for="roles1">Role</label>
                                                    <select class="editRoles form-control" id="roles${id}" name="roles${id}" value="${roles}">

                                                    </select>
                                                    </p>
                                                    
                                                </div>
                                                <div class="modal-footer">
                                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                                    <button onclick="updateUser(${id}); return false;" type="submit" class="editBtn btn btn-primary mx-1"  data-bs-dismiss="modal" >Edit</button>
                                                </div>
                                            </form>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td class="align-middle d-flex">
                                    <button type="button" class="btn btn-danger mx-1" data-bs-toggle="modal" data-bs-target="#userDelet${id}" >Delete</button>
                                    <!--Модальное окно удаление пользователя-->
                                    <div class="modal fade" id="userDelet${id}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                        <div class="modal-dialog">
                                            <div class="modal-content">
                                                <div class="modal-header">
                                                    <h1 class="modal-title fs-5" id="exampleModalLabel">Delete user</h1>
                                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Закрыть"></button>
                                                </div>
                                                <div class="modal-body text-center">
                                                    <label for="id">ID</label>
                                                    <input class="form-control bg-light" type="text" placeholder="${id}" readonly="readonly" id="id"><br>
                                                    <label for="firstName">First Name</label>
                                                    <input class="form-control bg-light" type="text" placeholder="${firstName}" readonly="readonly" id="firstName"><br>
                                                    <label for="lastName">Last Name</label>
                                                    <input class="form-control bg-light" type="text" placeholder="${lastName}" readonly="readonly" id="lastName"><br>
                                                    <label for="email" >Email</label>
                                                    <input class="form-control bg-light" type="email" placeholder="${email}" readonly="readonly" id="email"><br>
                                                    <label for="age" >Age</label>
                                                    <input class="form-control bg-light" type="text" placeholder="${age}" readonly="readonly" id="age"><br>
                                                    <label for="roles" >Role</label>
                                                    <div class="form-control bg-light" id="roles">${roleList}</div>
                                                </div>
                                                <div class="modal-footer">
                                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                                    <button  type="button" onclick="deleteUser(${id}); return false;" class="btn btn-danger mx-1" id="deleteBtn" data-bs-dismiss="modal">Delete</button>
                                                </div>
                                            </div>
                                        </div>
                 </div>
            </td>
        </tr>`);
}

let saveUsersRoles = null;

async function updatePage() {
    await getAllUsers();
    saveUsersRoles = await getAllRoles();
}

updatePage();