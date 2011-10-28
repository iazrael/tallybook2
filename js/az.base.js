;(function(window, undefined){
	var PACKAGE_STATUS = {
		UNDEFINED: 0,
		BUILDED: 1,
		LOADED: 2,
		INITED: 3
	};
	var LIBRARY_NAME = 'Az';
	
	var packageList = {};
	var dependenceQueue = {};
	
	var emptyFunction = function(){};
	
	var console = /* window.console || */ {
		log: emptyFunction,
		debug: emptyFunction,
		error: emptyFunction
	};
	
	/**
	 * @param {String} packageName
	 */
	var buildPackage = function(packageName){
		var pack = packageList[packageName];
		if(!pack){
			pack = window;
			var nameList = packageName.split('.');
			for(var i in nameList){
				if(!(nameList[i] in pack)){
					pack[nameList[i]] = {};
				}
				pack = pack[nameList[i]];
			}
			packageList[packageName] = pack;
		}
		if(!('packageName' in pack)){
			pack.packageName = packageName;
		}
		if(!('packageStatus' in pack)){
			pack.packageStatus = PACKAGE_STATUS.BUILDED;
		}
		console.log('buildPackage: ' + packageName);
		return pack;
	};
	
	var getPackage = function(packageName){
		if(packageList[packageName]){
			return packageList[packageName];
		}
		var nameList = packageName.split('.');
		var pack = window;
		for(var i in nameList){
			if(!(nameList[i] in pack)){
				return undefined;
			}
			pack = pack[nameList[i]];
		}
		return pack;
	};
	
	var getPackageStatus = function(packageName){
		var pack = getPackage(packageName);
		var status = pack ? pack.packageStatus : PACKAGE_STATUS.UNDEFINED;
		return status;
	};
	
	var isPackageBuilded = function(packageName){
		return getPackageStatus(packageName) === PACKAGE_STATUS.BUILDED;
	};
	
	var isPackageLoaded = function(packageName){
		return getPackageStatus(packageName) === PACKAGE_STATUS.LOADED;
	};
	
	var isPackageInited = function(packageName){
		return getPackageStatus(packageName) === PACKAGE_STATUS.INITED;
	};
	
	var initPackage = function(pack, requirePackages, constructor){
		if(typeof pack === 'string'){
			pack = getPackage(pack);
		}
		var require = {};
		var library = getPackage(LIBRARY_NAME);
		if(requirePackages){
			for(var r in requirePackages){
				require[r] = getPackage(requirePackages[r]);
			}
		}
		console.log('initPackage: ' + pack.packageName);
		if(constructor){
			constructor.call(pack, library, require);
			console.log('>>>' + pack.packageName + ' inited');
		}
		pack.packageStatus = PACKAGE_STATUS.INITED;
		runDependenceQueue(pack.packageName);
	};
	
	var checkDependence = function(requirePackages){
		if(!requirePackages){
			return true;
		}
		var requirePackageName;
		for(var r in requirePackages){
			requirePackageName = requirePackages[r];
			if(!isPackageInited(requirePackageName)){
				return false;
			}
		}
		return true;
	};
	
	var addToDependenceQueue = function(packageName, requirePackages, constructor){
		console.log('addToDependenceQueue, package: ' + packageName);
		var requirePackageName;
		for(var r in requirePackages){
			requirePackageName = requirePackages[r];
			if(!dependenceQueue[requirePackageName]){
				dependenceQueue[requirePackageName] = [];
			}
			dependenceQueue[requirePackageName].push({
				packageName: packageName, 
				requirePackages: requirePackages, 
				constructor: constructor
			});
		}
	};
	
	var runDependenceQueue = function(packageName){
		var requireQueue = dependenceQueue[packageName];
		if(!requireQueue){
			return false;
		}
		console.log('runDependenceQueue, dependented package: ' + packageName);
		var flag = false, require;
		for(var r = 0; r < requireQueue.length; r++ ){
			require = requireQueue[r];
			if(checkDependence(require.requirePackages)){
				flag = true;
				initPackage(require.packageName, require.requirePackages, require.constructor);
			}
		}
		delete dependenceQueue[packageName];
		return flag;
	};
	
	/**
	 * @param {Object} requirePackages
	 * { shortName: packageName } or [packageName]
	 */
	var package = function(){
		var packageName, requirePackages,  constructor;
		packageName = arguments[0];
		if(arguments.length === 3){
			requirePackages = arguments[1];
			constructor = arguments[2];
		}else{
			constructor = arguments[1];
		}
		var pack = buildPackage(packageName);
		if(pack.packageStatus === PACKAGE_STATUS.BUILDED){
			pack.packageStatus = PACKAGE_STATUS.LOADED;
		}
		if(requirePackages && !checkDependence(requirePackages)){
			addToDependenceQueue(packageName, requirePackages, constructor);
		}else{
			initPackage(pack, requirePackages, constructor);
		}
	};
	
	/**
	 * init the library
	 */
	package(LIBRARY_NAME, function(z){
		z.PACKAGE_STATUS = PACKAGE_STATUS;
		z.package = package;
		z.getPackage = getPackage;
		z.getPackageStatus = getPackageStatus;
		
	});
	
})(window);