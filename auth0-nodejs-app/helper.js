const ManagementClient = require('auth0').ManagementClient;
const envConfig = require('dotenv').config();

const management = new ManagementClient({
	domain: process.env.AUTH0_DOMAIN,
	clientId: process.env.AUTH0_CLIENT_ID,
	clientSecret: process.env.AUTH0_CLIENT_SECRET
});

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

const rule = async () => {
	const role = 'affiliate';
	const otherRoles = ['student', 'affiliate'];
	const roleExistsInOtherRoles =
		otherRoles.find((each) => each === role) != null;
	const permissions = await getPermissionsForAllRoles();
	const filteredPermissions = [];
	if (roleExistsInOtherRoles) {
		for (let r of otherRoles) {
			const permission = permissions.flat().find((p) => {
				return p.role.toLowerCase() === r.toLowerCase();
			});
			if (permission) {
				filteredPermissions.push(permission);
			}
		}
	} else {
		const permission = permissions
			.flat()
			.find((p) => p.role.toLowerCase() === role.toLowerCase());
		if (permission) {
			filteredPermissions.push(permission);
		}
		for (let r of otherRoles) {
			const otherPermission = permissions.flat().find((p) => {
				return p.role.toLowerCase() === r.toLowerCase();
			});
			if (otherPermission) {
				filteredPermissions.push(otherPermission);
			}
		}
	}
	return filteredPermissions;
};

rule().then((pers) => {
	console.log(pers);
});
