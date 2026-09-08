def PDF_Generator(Questions_for_pdf,Title_data):
    print("Question_for_pdf and Title_data Received from Main_Directory_Controller.py BY PDF_Generator.py")
    from reportlab.lib.pagesizes import A4
    from svglib.svglib import svg2rlg
    from reportlab.lib import colors
    from reportlab.graphics import renderPDF
    from reportlab.platypus import Paragraph,BaseDocTemplate,PageTemplate,Frame,XPreformatted
    from reportlab.lib.styles import ParagraphStyle
    from reportlab.lib.enums import TA_RIGHT,TA_CENTER,TA_LEFT
    from reportlab.pdfbase.pdfmetrics import stringWidth
    from pypdf import PdfReader,PdfWriter
    import os


    return_path = []
    path_for_simplex_duplex = []
    def make_black(element):
        if hasattr(element, "fillColor"):
            element.fillColor = colors.black

        if hasattr(element, "strokeColor"):
            element.strokeColor = colors.black

        if hasattr(element, "contents"):
            for child in element.contents:
                make_black(child)

    def simplex_front_creator(path,test_series_name):
        writer = PdfWriter()
        for specific_file in path:
            c=0
            reader = PdfReader(specific_file)
            page_num = len(reader.pages)
            while True:
                writer.add_page(reader.pages[c])
                c += 2
                if c >= page_num:
                    break
        BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        save_path = os.path.join(BASE_DIR,"Archive","storage",test_series_name,"Simplex",test_series_name+"_simplex_Front.pdf")
        os.makedirs(os.path.dirname(save_path), exist_ok=True)
        with open(save_path,"wb") as file:
            writer.write(file)

    def simplex_back_creator(path, test_series_name):
        writer = PdfWriter()

        for specific_file in path:
            reader = PdfReader(specific_file)
            page_num = len(reader.pages)
            if page_num % 2 == 0:
                c = 0
            else:
                writer.add_blank_page( width=reader.pages[0].mediabox.width,height=reader.pages[0].mediabox.height)
                c = 1
            while True:
                if c >= page_num:
                    break
                writer.add_page(reader.pages[::-1][c])
                c += 2


        BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        save_path = os.path.join(BASE_DIR, "Archive", "storage",test_series_name, "Simplex", test_series_name + "_simplex_Back.pdf")
        os.makedirs(os.path.dirname(save_path), exist_ok=True)
        with open(save_path, "wb") as file:
            writer.write(file)

    def Duplex_creator(path, test_series_name):
        writer = PdfWriter()
        for specific_file in path:
            reader = PdfReader(specific_file)
            page_num = len(reader.pages)
            for page in reader.pages:
                writer.add_page(page)
            if page_num % 2 == 0:
                pass
            else:
                writer.add_blank_page( width=reader.pages[0].mediabox.width,height=reader.pages[0].mediabox.height)
        BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        save_path = os.path.join(BASE_DIR, "Archive", "storage",test_series_name, "Duplex", test_series_name + "_Duplex.pdf")
        os.makedirs(os.path.dirname(save_path), exist_ok=True)
        with open(save_path, "wb") as file:
            writer.write(file)

    def wrap_text_for_xpreformatted(text, style, avail_width):
        wrapped_lines = []

        for line in str(text).split("\n"):

            # Empty line stays empty
            if line == "":
                wrapped_lines.append("")
                continue

            # Measure the whole original line
            total_width = stringWidth(
                line,
                style.fontName,
                style.fontSize
            )

            # Already fits
            if total_width <= avail_width:
                wrapped_lines.append(line)
                continue

            target_width = avail_width

            start = 0
            line_length = len(line)

            while True:

                current_width = 0
                end = start

                # Walk characters until target width is reached
                while end < line_length:
                    character = line[end]

                    character_width = stringWidth(
                        character,
                        style.fontName,
                        style.fontSize
                    )

                    current_width += character_width
                    end += 1

                    if current_width >= target_width:
                        break

                # Reached the end of the line
                if end >= line_length:
                    wrapped_lines.append(line[start:end])
                    break

                # Dynamic line adjuster
                reverse_walker = 1
                no_space = False
                for iterate in line[start:end]:
                    space_finder = line[end - reverse_walker]
                    if space_finder == " " and reverse_walker < 22:
                        split_point = end - reverse_walker
                        break
                    elif reverse_walker >= 22:
                        split_point = end - 1
                        no_space = True
                        break
                    reverse_walker += 1
                wrapped_lines.append(
                    line[start:split_point]
                )
                # Removes Unnecessary space when needed
                if no_space:
                    pass
                else:
                    split_point += 1

                start = split_point

        return "\n".join(wrapped_lines)

    PAGE_WIDTH, PAGE_HEIGHT = A4

    LEFT_MARGIN = 50

    LEFT_EDGE = 15 + LEFT_MARGIN
    RIGHT_EDGE = PAGE_WIDTH - 15

    def draw_page_1(pdf,doc):
        # =========================
        # OUTER PAGE RECTANGLE
        # =========================
        pdf.rect(
            LEFT_EDGE,
            15,
            RIGHT_EDGE - LEFT_EDGE,
            PAGE_HEIGHT - 30
        )

        # =========================
        # HEADER BOX
        # =========================
        header_bottom = PAGE_HEIGHT - 115
        header_top = PAGE_HEIGHT - 15

        pdf.rect(
            LEFT_EDGE,
            header_bottom,
            RIGHT_EDGE - LEFT_EDGE,
            header_top - header_bottom
        )

        c = 57

        pdf.line(
            LEFT_EDGE,
            PAGE_HEIGHT - 125 + c,
            RIGHT_EDGE,
            PAGE_HEIGHT - 125 + c
        )
        #title
        title_style = ParagraphStyle(
            "TitleStyle",
            fontName="Helvetica-Bold",
            fontSize=18,
            leading=16,
            alignment=TA_CENTER
        )

        title_frame = Frame(
            LEFT_EDGE,
            PAGE_HEIGHT - 125 + c,
            450,
            53,
            topPadding=15,
            showBoundary=0
        )
        title_text = Paragraph(
            f"{title}",
            title_style
        )
        title_frame.addFromList([title_text], pdf)

        # =========================
        # SET CODE BOX
        # =========================
        set_code_width = 55
        set_code_height = 35
        set_code_x = PAGE_WIDTH - 15 - set_code_width - 8
        set_code_y = PAGE_HEIGHT - 59

        pdf.rect(
            set_code_x,
            set_code_y,
            set_code_width,
            set_code_height
        )

        pdf.setFont("Helvetica-Bold", 14)

        pdf.drawCentredString(
            set_code_x + set_code_width / 2,
            set_code_y + 12.5,
            str(SET_code)
        )

        # ===========================
        # QUESTION PAPER DETAIL AREA
        # ===========================

        pdf.drawString(
            LEFT_EDGE + 5,
            745,
            "Full Marks:"+Marks
        )

        pdf.drawString(
            LEFT_EDGE + 230,
            745,
            "SET:" + SET
        )

        time_style = ParagraphStyle(
            "TimeStyle",
            fontName = "Helvetica-Bold",
            fontSize = 14,
            leading = 16,
            alignment = TA_RIGHT
        )
        time_frame = Frame(
            340,
            header_bottom ,
            240,
            47,
            topPadding=15,
            showBoundary=0
        )
        time_text = Paragraph(
            f"Time: {TIME}",
            time_style
        )
        time_frame.addFromList([time_text], pdf)

        # =========================
        # QUESTION PAPER AREA
        # =========================
        question_area_top = header_bottom
        question_area_bottom = 40

        pdf.rect(
            LEFT_EDGE,
            question_area_bottom,
            RIGHT_EDGE - LEFT_EDGE,
            question_area_top - question_area_bottom
        )

        # =========================
        # COLUMN SPLITTER
        # =========================
        splitter_x = LEFT_EDGE + (RIGHT_EDGE - LEFT_EDGE) / 2
        pdf.line(
            splitter_x,
            question_area_bottom,
            splitter_x,
            question_area_top
        )

        # =========================
        # FOOTER AREA
        # =========================
        pdf.drawCentredString(
            splitter_x,
            23,
            "1"
        )

        #LOGO
        BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        logo_path = os.path.join(BASE_DIR, "COMMUNICATOR", "static", "Group 8.svg")
        logo = svg2rlg(logo_path)
        make_black(logo)

        target_width = 20

        scale = target_width / logo.width

        logo.scale(scale, scale)

        renderPDF.draw(
            logo,
            pdf,
            558,
            18
        )

        #Institution name
        pdf.setFont("Helvetica", 8)
        pdf.setFillColorRGB(0.45, 0.45, 0.45)

        pdf.drawString(
            LEFT_EDGE + 5,
            24,
            INSTITUTION
        )

        pdf.setFillColorRGB(0, 0, 0)  # reset for everything afterward

    def draw_page_2(pdf,doc):
        page_number = doc.page
        # =========================
        # OUTER PAGE RECTANGLE
        # =========================
        pdf.rect(
            LEFT_EDGE,
            15,
            RIGHT_EDGE - LEFT_EDGE,
            PAGE_HEIGHT - 30
        )

        # =========================
        # QUESTION PAPER AREA
        # =========================
        question_area_top = PAGE_HEIGHT - 15
        question_area_bottom = 40

        pdf.rect(
            LEFT_EDGE,
            question_area_bottom,
            RIGHT_EDGE - LEFT_EDGE,
            question_area_top - question_area_bottom
        )

        # =========================
        # COLUMN SPLITTER
        # =========================
        splitter_x = LEFT_EDGE + (RIGHT_EDGE - LEFT_EDGE) / 2

        pdf.line(
            splitter_x,
            question_area_bottom,
            splitter_x,
            question_area_top
        )

        # =========================
        # FOOTER AREA
        # =========================

        pdf.drawCentredString(
            splitter_x,
            23,
            str(page_number)
        )

        #set code
        pdf.setFillColorRGB(0.45, 0.45, 0.45)
        pdf.setFont("Helvetica", 10)
        pdf.drawCentredString(
            540,
            24,
            str(SET_code)
        )
        pdf.setFillColorRGB(0, 0, 0)  # reset for everything afterward

        #LOGO
        BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        logo_path = os.path.join(BASE_DIR, "COMMUNICATOR", "static", "Group 8.svg")
        logo = svg2rlg(logo_path)
        make_black(logo)

        target_width = 20

        scale = target_width / logo.width

        logo.scale(scale, scale)

        renderPDF.draw(
            logo,
            pdf,
            558,
            18
        )

        # Institution name
        pdf.setFont("Helvetica", 8)
        pdf.setFillColorRGB(0.45, 0.45, 0.45)

        pdf.drawString(
            LEFT_EDGE + 5,
            24,
            INSTITUTION
        )

        pdf.setFillColorRGB(0, 0, 0)  # reset for everything afterward

    def PDF_Creator():
        BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

        archive_dir = os.path.join(BASE_DIR,"Archive","storage",str(title.replace(" ","_")),str(SET_code))

        os.makedirs(archive_dir, exist_ok=True)

        pdf_path = os.path.join(archive_dir,Name_of_pdf)
        path_for_simplex_duplex.append(pdf_path)
        path_for_sending = os.path.join("/Dowload",str(title.replace(" ","_")),str(SET_code),str(Name_of_pdf))
        return_path.append(path_for_sending)
        splitter_x = LEFT_EDGE + (RIGHT_EDGE - LEFT_EDGE) / 2

        left_frame = Frame(
            LEFT_EDGE,
            40,
            splitter_x - LEFT_EDGE,
            PAGE_HEIGHT - 155,
        )

        right_frame = Frame(
            splitter_x,
            40,
            RIGHT_EDGE - splitter_x,
            PAGE_HEIGHT - 155,
        )

        left_frame2 = Frame(
            LEFT_EDGE,
            40,
            splitter_x - LEFT_EDGE,
            PAGE_HEIGHT - 55,
        )

        right_frame2 = Frame(
            splitter_x,
            40,
            RIGHT_EDGE - splitter_x,
            PAGE_HEIGHT - 55,
        )

        page_template = PageTemplate(
            id="exam",
            frames=[left_frame, right_frame],
            onPage=draw_page_1,
            autoNextPageTemplate="exam2"
        )

        page_template2 = PageTemplate(
            id="exam2",
            frames=[left_frame2, right_frame2],
            onPage=draw_page_2
        )

        doc = BaseDocTemplate(
            pdf_path,
            pagesize=A4
        )

        doc.addPageTemplates([page_template,page_template2])
        doc.build(story)

    question_style = ParagraphStyle(
        "question_style",
        fontName="Helvetica-Bold",
        fontSize=14,
        leading=16,
        alignment=TA_LEFT
    )
    option_style = ParagraphStyle(
        "option_Style",
        fontName="Helvetica",
        fontSize=13,
        leading=16,
        alignment=TA_LEFT
    )
    question_available_width = (LEFT_EDGE + (RIGHT_EDGE - LEFT_EDGE) / 2 - LEFT_EDGE - 12)
    for q_set in Questions_for_pdf:
        story = []
        SET_code = q_set["set_code"]
        title = Title_data["testSeriesName"]
        TIME = Title_data["time"]
        SET = Title_data["setCode"]
        Marks = Title_data["totalMarks"]
        INSTITUTION = Title_data["institution"]
        Name_of_pdf = str(title.replace(" ","_")) + "_"+str(SET) + "_" + str(SET_code) + ".pdf"
        for question in q_set["question_set"]:
            print(q_set)
            print(question)
            question_text = (
                    "Q"
                    + str(question["serial"])
                    + ". "
                    + str(question["question"])
            )

            optionA_text = "A)" + str(question["option1"])
            optionB_text = "B)" + str(question["option2"])
            optionC_text = "C)" + str(question["option3"])
            optionD_text = "D)" + str(question["option4"])

            question_text = wrap_text_for_xpreformatted(
                question_text,
                question_style,
                question_available_width
            )

            optionA_text = wrap_text_for_xpreformatted(
                optionA_text,
                option_style,
                question_available_width
            )

            optionB_text = wrap_text_for_xpreformatted(
                optionB_text,
                option_style,
                question_available_width
            )

            optionC_text = wrap_text_for_xpreformatted(
                optionC_text,
                option_style,
                question_available_width
            )

            optionD_text = wrap_text_for_xpreformatted(
                optionD_text,
                option_style,
                question_available_width
            )
            Question = XPreformatted(question_text, question_style)
            optionA = XPreformatted(optionA_text, option_style)
            optionB = XPreformatted(optionB_text, option_style)
            optionC = XPreformatted(optionC_text, option_style)
            optionD = XPreformatted(optionD_text, option_style)
            story.append(Question)
            story.append(optionA)
            story.append(optionB)
            story.append(optionC)
            story.append(optionD)
        PDF_Creator()
    simplex_front_creator(path_for_simplex_duplex[1:],str(title.replace(" ","_")))
    simplex_back_creator(path_for_simplex_duplex[1:], str(title.replace(" ", "_")))
    Duplex_creator(path_for_simplex_duplex[1:], str(title.replace(" ", "_")))
    return return_path