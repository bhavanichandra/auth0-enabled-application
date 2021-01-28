const ManagementClient = require('auth0').ManagementClient;
const envConfig = require('dotenv').config();

if (envConfig.error) {
	console.log('Cannot find .env file in the project directory');
	return;
}

const management = new ManagementClient({
	domain: process.env.AUTH0_DOMAIN,
	clientId: process.env.AUTH0_CLIENT_ID,
	clientSecret: process.env.AUTH0_CLIENT_SECRET
});

const createUserRole = async (role) => {
	const createRole = await management.createRole({
		name: role,
		description: 'Role Created Via Auth0 Rule'
	});

	return createRole;
};

const getPermissionsForUser = async (id) => {
	const userPermissions = await management.getUserPermissions({ id });
	return userPermissions;
};

const addPermissionsToRole = async (role, permissions = '', identifier) => {
	const savedRole = await createUserRole(role);
	if (permissions.length <= 0) {
		return;
	}
	console.log('Role', savedRole);
	const permissionData = {
		permissions: permissions.split(',').map((eachPermission) => ({
			permission_name: eachPermission,
			resource_server_identifier: identifier
		}))
	};

	const addPermissionsToRole = await management.addPermissionsInRole(
		{ id: savedRole.id },
		permissionData
	);
	return addPermissionsToRole;
};

const getRoles = async () => {
	const roles = await management.getRoles();
	return roles;
};

const getPermissionsForAllRoles = async () => {
	const roles = await getRoles();
	const permissionMap = roles.map(async (role) => {
		const permissions = await management.getPermissionsInRole({
			id: role.id
		});
		const rolePermissionMap = permissions.slice().map((each) => {
			return { ...each, role: role.name, roleId: role.id };
		});
		return rolePermissionMap;
	});
	const response = Promise.all(permissionMap);
	return response;
};

const auth0Rule = async (user, context) => {
	const roles = context.authorization.roles;
	const userRole = user.eduPersonPrimaryAffiliation;
	const otherUserRoles = user.eduPersonAffiliation;
	if (roles.length == 0) {
		// Get Role from user, check if role is already exists, if exists assign to user 
		const permissions = await getPermissionsForAllRoles();
		const permissionObject = permissions
			.flat()
			.find((each) => each.role === userRole);
		console.log(permissionObject);
		if (permissionObject) {
			const assignRoleToUser = await management.assignRolestoUser(
				{
					id: user.user_id
				},
				{ roles: [permissionObject.roleId] }
			);
			return assignRoleToUser;
		} else {
			throw new Error(`Specified role: ${userRole} is not created in Auth0`);
		}
	} else {
		console.log('Role is already assigned');
		return null;
	}
};

const user = require('./user.json');
const context = require('./context.json');

auth0Rule(user, context).then((res) => console.log(res));

