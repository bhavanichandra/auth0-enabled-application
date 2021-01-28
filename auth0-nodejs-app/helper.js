const ManagementClient = require('auth0').ManagementClient;
const envConfig = require('dotenv').config();

const management = new ManagementClient({
	domain: process.env.AUTH0_DOMAIN,
	clientId: process.env.AUTH0_CLIENT_ID,
	clientSecret: process.env.AUTH0_CLIENT_SECRET
});

const getPermissionsForAllRoles = async () => {
	const roles = await management.getRoles();
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

const findAndAssignRolesToUser = async (userId, otherRoles) => {
	const permissions = await getPermissionsForAllRoles();
	const result = [];
	for (let r of otherRoles) {
		const permission = permissions.flat().find((p) => {
			return p.role.toLowerCase() === r.toLowerCase();
		});
		const response = {};
		if (permission) {
			try {
				await management.assignRolestoUser(
					{ id: userId },
					{ roles: [permission.roleId] }
				);
				response.success = true;
				response.message = `Role: ${r} is assigned to user: ${userId}`;
			} catch (error) {
				response.success = false;
				response.message = error.message;
			}
		} else {
			response.success = false;
			response.message = `Role: ${r} doesn't exists in Auth0`;
		}
		result.push(response);
	}
	return result;
};

const rule = async (user, context) => {
	const roles = context.authorization.roles;
	const otherRoles = user.eduPersonAffiliation;
	if (roles.length == 0) {
		await findAndAssignRolesToUser(user.user_id, otherRoles);
		return { user, context };
	} else {
		const newRoles = [];
		for (let r of roles) {
			const shibbolethRoles = otherRoles.find(
				(role) => r.toLowerCase() === role.toLowerCase()
			);
			newRoles.push(shibbolethRoles);
		}
		if (newRoles.length > 0) {
			await findAndAssignRolesToUser(user.user_id, newRoles);
			return { user, context };
		} else {
			return { user, context };
		}
	}
};

const user = require('./user.json');
const context = require('./context.json');

rule(user, context).then((pers) => {
	console.log(pers);
});
