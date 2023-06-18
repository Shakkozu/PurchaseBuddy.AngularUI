export interface ProductCategoryNode {
	name: string;
	guid: string;
	children?: ProductCategoryNode[];
	expandable?: boolean;
}
export interface ExampleFlatNode {
	expandable: boolean;
	name: string;
	level: number;
	guid: string;
}
export interface ProductCategoryFlatNode {
	name: string;
	level: number;
	guid: string;
	expandable: boolean;
}

export interface MicroProductCategory {
	name: string;
	guid: string;	
}