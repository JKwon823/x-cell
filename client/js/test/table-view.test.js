const fs = require('fs');
const TableModel = require('../table-model');
const TableView = require('../table-view');

describe('table-view', () => {

	beforeEach(() => {
		const fixturePath = './client/js/test/fixtures/sheet-container.html';
		const html = fs.readFileSync(fixturePath, 'utf8');
		document.documentElement.innerHTML = html;
	});

	describe('formula bar', () => {
		it('makes changes TO the value of the current cell', () => {
			const model = new TableModel(3, 3);
			const view = new TableView(model);
			view.init();

			let trs = document.querySelectorAll('TBODY TR');
			let td = trs[0].cells[0];
			expect(td.textContent).toBe('');

			document.querySelector('#formula-bar').value = '65';
			view.handleFormulaBarChange();

			trs = document.querySelectorAll('TBODY TR');
			expect(trs[0].cells[0].textContent).toBe('65');
		});

		it('updates FROM the value of the current cell', () => {
			const model = new TableModel(3, 3);
			const view = new TableView(model);
			model.setValue({col: 2, row: 1}, '123');
			view.init()

			const formulaBarEl = document.querySelector('#formula-bar')
			expect(formulaBarEl.value).toBe('');

			const trs = document.querySelectorAll('TBODY TR');
			trs[1].cells[2].click();

			expect(formulaBarEl.value).toBe('123');
		});
	});

	describe('table body', () => {
		it('highlights the current cell when clicked', () => {
			const model = new TableModel(10, 5);
			const view = new TableView(model);
			view.init();

			let trs = document.querySelectorAll('TBODY TR');
			let td = trs[2].cells[3];
			expect(td.className).toBe('');

			td.click();

			trs = document.querySelectorAll('TBODY TR');
			td = trs[2].cells[3];
			expect(td.className).not.toBe('');
		});
		it('has the right size', () => {
			const numCols = 6;
			const numRows = 10;
			const model = new TableModel(numCols, numRows);
			const view = new TableView(model);
			view.init();

			let ths = document.querySelectorAll('THEAD TH');
			expect(ths.length).toBe(numCols);
		});

		it('fills in values from the model', () => {

			const model = new TableModel(3, 3);
			const view = new TableView(model);
			model.setValue({col: 2, row: 1}, '123');
			view.init();

			const trs = document.querySelectorAll('TBODY TR');
			expect(trs[1].cells[2].textContent).toBe('123');
		});

		it('adds total of number inputs in each col to sum-row', () => {

			const model = new TableModel(3, 3);
			const view = new TableView(model);
			model.setValue({col: 1, row: 1}, '823');
			model.setValue({col: 2, row: 1}, '123');
			model.setValue({col: 2, row: 2}, '456');
			view.init();

			const ths = document.querySelectorAll('TBODY TH');
			let labelTexts = Array.from(ths).map(el => el.textContent);
			expect(labelTexts).toEqual(['', '823', '579']); 
		});

		it('ignores inputs that are not numbers', () => {

			const model = new TableModel(3, 3);
			const view = new TableView(model);
			model.setValue({col: 1, row: 1}, 'ABC');
			model.setValue({col: 2, row: 1}, 'XYZ');
			model.setValue({col: 2, row: 2}, '123');
			view.init();

			const ths = document.querySelectorAll('TBODY TH');
			let labelTexts = Array.from(ths).map(el => el.textContent);
			expect(labelTexts).toEqual(['', '', '123']); 
		});

		it('adds negative numbers to sum-row', () => {

			const model = new TableModel(3, 3);
			const view = new TableView(model);
			model.setValue({col: 1, row: 1}, '-7');
			model.setValue({col: 2, row: 1}, '-1');
			model.setValue({col: 2, row: 2}, '-4');
			view.init();

			const ths = document.querySelectorAll('TBODY TH');
			let labelTexts = Array.from(ths).map(el => el.textContent);
			expect(labelTexts).toEqual(['', '-7', '-5']); 
		});

		it('adds zero to sum-row', () => {

			const model = new TableModel(3, 3);
			const view = new TableView(model);
			model.setValue({col: 1, row: 1}, '0');
			model.setValue({col: 2, row: 1}, '-2');
			model.setValue({col: 2, row: 2}, '2');
			view.init();

			const ths = document.querySelectorAll('TBODY TH');
			let labelTexts = Array.from(ths).map(el => el.textContent);
			expect(labelTexts).toEqual(['', '0', '0']); 
		});
	});

	describe('table header', () => {
		it('has valid column header labels', () => {
			const numCols = 6;
			const numRows = 10;
			const model = new TableModel(numCols, numRows);
			const view = new TableView(model);
			view.init();

			let ths = document.querySelectorAll('THEAD TH');
			expect(ths.length).toBe(numCols);

			let labelTexts = Array.from(ths).map(el => el.textContent);
			expect(labelTexts).toEqual(['A', 'B', 'C', 'D', 'E', 'F']);
		});
	});

})