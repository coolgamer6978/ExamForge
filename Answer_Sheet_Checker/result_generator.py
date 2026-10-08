from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import Paragraph, BaseDocTemplate, PageTemplate, Frame,Table,TableStyle,Spacer
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_CENTER
import os,json
from reportlab.pdfbase import pdfmetrics

def Result_Generator(data):

    # ==========================================================
    # Unpacking DATA
    # ==========================================================

    Total_Marks = data["Total_Marks"]
    Achieved_Marks = data["Achieved_Marks"]
    Unattempted_Questions = data["Unattempted_Questions"]
    wrong_questions = data["wrong_questions"]

    Student_Name = data["Student_Name"]
    Test_series_name = data["test_series"]
    Set_Code = data["set_code"]
    Institution = data["Name_of_Institution"]

    wrong_diagnostic = data["wrong_diagnostic"]

    #file setup
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    #counter manager
    with open(os.path.join(BASE_DIR,"Answer_Sheet_Checker","counter.json"),"r") as f:
        current_count = json.load(f)[0]
        updated_count = [current_count + 1]
    with open(os.path.join(BASE_DIR,"Answer_Sheet_Checker","counter.json"),"w") as f:
        json.dump(updated_count,f)
    # ==========================================================
    # PAGE CONSTANTS
    # ==========================================================
    #ABSOLUTE measurement
    PAGE_WIDTH, PAGE_HEIGHT = A4
    #Margin handler
    LEFT_MARGIN = 0
    #outer rectangle dimensions
    LEFT_EDGE_of_outer_rectangle_border = 15 + LEFT_MARGIN
    RIGHT_EDGE_of_outer_rectangle_border = PAGE_WIDTH - 15
    TOP_EDGE = PAGE_HEIGHT - 15
    BOTTOM_EDGE = 15
    #Instituition title dimensions
    Instituition_title_AREA_TOP = TOP_EDGE
    Instituition_title_AREA_BOTTOM = TOP_EDGE - 50
    #footer dimensions
    Footer_TOP = 40
    #Result region dimension
    Result_title_AREA_TOP = Instituition_title_AREA_BOTTOM
    Result_title_AREA_BOTTOM = Instituition_title_AREA_BOTTOM - 40
    def make_black(element):
        if hasattr(element, "fillColor"):
            element.fillColor = colors.black

        if hasattr(element, "strokeColor"):
            element.strokeColor = colors.black

        if hasattr(element, "contents"):
            for child in element.contents:
                make_black(child)

    # region Styles
    # ==========================================================
    # STYLES
    # ==========================================================

    Institution_title_style = ParagraphStyle(
        "InstituteTitle",
        fontName="Helvetica-Bold",
        fontSize=18,
        leading=20,
        alignment=TA_CENTER,
        shaping=1
    )


    table_header_style = ParagraphStyle(
        "TableHeader",
        fontName="Helvetica-Bold",
        fontSize=8,
        leading=10,
        alignment=TA_CENTER,
        shaping=1
    )

    table_body_style = ParagraphStyle(
        "TableBody",
        fontName="Helvetica",
        fontSize=8,
        leading=10,
        alignment=TA_CENTER,
        shaping=1
    )
    #endregion
    #region Footer
    # ==========================================================
    # FOOTER
    # ==========================================================

    def draw_footer(pdf, page_number):

        # Footer page number
        pdf.line(
            LEFT_EDGE_of_outer_rectangle_border,
            Footer_TOP,
            RIGHT_EDGE_of_outer_rectangle_border,
            Footer_TOP
        )
        pdf.setFont(
            "Helvetica",
            12
        )

        splitter_x = LEFT_EDGE_of_outer_rectangle_border + (
                RIGHT_EDGE_of_outer_rectangle_border - LEFT_EDGE_of_outer_rectangle_border
        ) / 2

        pdf.drawCentredString(
            splitter_x,
            23,
            str(page_number)
        )

        # Institution name
        pdf.setFillColorRGB(
            0.45,
            0.45,
            0.45
        )

        pdf.setFont(
            "Helvetica",
            8
        )

        pdf.drawString(
            LEFT_EDGE_of_outer_rectangle_border + 5,
            24,
            Institution
        )
        pdf.setFillColorRGB(
            0,
            0,
            0
        )
        # Logo
        from svglib.svglib import svg2rlg
        from reportlab.graphics import renderPDF

        logo_path = os.path.join(BASE_DIR,"COMMUNICATOR","static","Group 8.svg")
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
    #endregion
    #region Basic calc
    # ==========================================================
    # Basic calculation
    # ==========================================================
    def Grader(x):
        if x >= 95:
            return "A+"
        elif x >= 90:
            return "A"
        elif x >= 80:
            return "B+"
        elif x >= 75:
            return "B"
        elif x >= 70:
            return "C+"
        elif x >= 60:
            return "C"
        elif x >= 50:
            return "D"
        else:
            return "F"
    p = (Achieved_Marks/Total_Marks) * 100
    Grade = Grader(p)
    percentage = str(p)+"%"
    #endregion
    # ==========================================================
    # PAGE 1 CANVAS
    # ==========================================================

    def draw_page_1(pdf, doc):

        # ------------------------------------------------------
        # OUTER RECTANGLE
        # ------------------------------------------------------

        pdf.rect(
            LEFT_EDGE_of_outer_rectangle_border,
            BOTTOM_EDGE,
            RIGHT_EDGE_of_outer_rectangle_border-LEFT_EDGE_of_outer_rectangle_border,
            TOP_EDGE-BOTTOM_EDGE
        )
        # ------------------------------------------------------
        # Instituition Title
        # ------------------------------------------------------
        title_frame = Frame(
            LEFT_EDGE_of_outer_rectangle_border,
            Instituition_title_AREA_BOTTOM,
            RIGHT_EDGE_of_outer_rectangle_border - LEFT_EDGE_of_outer_rectangle_border,
            Instituition_title_AREA_TOP-Instituition_title_AREA_BOTTOM,
            topPadding=12,
            showBoundary=0
        )
        title_text = Paragraph(
            f"{Institution}",
            Institution_title_style
        )
        title_frame.addFromList([title_text], pdf)
        pdf.line(
            LEFT_EDGE_of_outer_rectangle_border,
            Instituition_title_AREA_BOTTOM,
            RIGHT_EDGE_of_outer_rectangle_border,
            Instituition_title_AREA_BOTTOM
        )
        # ------------------------------------------------------
        # Result Title
        # ------------------------------------------------------
        pdf.line(
            LEFT_EDGE_of_outer_rectangle_border,
            Result_title_AREA_BOTTOM,
            RIGHT_EDGE_of_outer_rectangle_border,
            Result_title_AREA_BOTTOM
        )
        #font height calc
        font = pdfmetrics.getFont("Helvetica")
        font_size  = 15
        font_height = ((font.face.ascent - font.face.descent) / 1000 * font_size)
        Visual_Displacement = font_height/2-2
        pdf.setFont("Helvetica-Bold", font_size)
        pdf.drawCentredString(
            (RIGHT_EDGE_of_outer_rectangle_border+LEFT_EDGE_of_outer_rectangle_border)/2,
            (Result_title_AREA_TOP+Result_title_AREA_BOTTOM)/2-Visual_Displacement,
            "Report Card"
        )

        # ------------------------------------------------------
        # Test_series_name
        # ------------------------------------------------------
        font_size = 13
        text_width = pdfmetrics.stringWidth(Test_series_name,"Helvetica",font_size)+11
        pdf.setFont("Helvetica-Bold", font_size)
        text_y = Result_title_AREA_BOTTOM-Visual_Displacement-7
        text_x = (RIGHT_EDGE_of_outer_rectangle_border + LEFT_EDGE_of_outer_rectangle_border) / 2
        pdf.drawCentredString(
            text_x,
            text_y,
            Test_series_name
        )
        buffer_for_underline = -1
        pdf.setLineWidth(0.5)
        pdf.line(
            text_x-text_width/2,
            text_y+buffer_for_underline,
            text_x+text_width/2,
            text_y+buffer_for_underline
        )
        pdf.setLineWidth(1)
        # ------------------------------------------------------
        # SUMMARY-feilds
        # ------------------------------------------------------
        summary_top = text_y+buffer_for_underline-5
        required_buffers_for_values = []
        c = 0
        pdf.setFont("Helvetica-Bold", 10)
        if Student_Name == "":
            ID = Set_Code
            feilds = "Set Code:/Achived Marks:/Percentage:/Grade:/Wrong Questions:/Unattempted Questions:"
        else:
            ID = Student_Name
            feilds = "Name:/Achived Marks:/Percentage:/Grade:/Wrong Questions:/Unattempted Questions:"

        for feild in feilds.split("/"):
            c -= 15
            pdf.drawString(
                LEFT_EDGE_of_outer_rectangle_border+5,
                summary_top+c,
                feild
            )
            required_buffers_for_values.append(pdf.stringWidth(feild,"Helvetica-Bold",10)+2)
        # ------------------------------------------------------
        # SUMMARY-Values
        # ------------------------------------------------------
        # Identification
        values = [ID,str(Achieved_Marks)+"/"+str(Total_Marks), percentage, Grade, wrong_questions, Unattempted_Questions]
        c = 0
        for data_value in zip(required_buffers_for_values, values):
            c-=15
            current_buffer = data_value[0]
            current_value = data_value[1]
            pdf.drawString(
                LEFT_EDGE_of_outer_rectangle_border+5+current_buffer,
                summary_top+c,
                str(current_value)
            )
        # ------------------------------------------------------
        # DIVIDER ABOVE TABLE
        # ------------------------------------------------------

        divider_y = summary_top+c-10
        pdf.line(
            LEFT_EDGE_of_outer_rectangle_border,
            divider_y,
            RIGHT_EDGE_of_outer_rectangle_border,
            divider_y
        )

        # ------------------------------------------------------
        # VERTICAL SPLITTER
        # ------------------------------------------------------

        splitter_x = (LEFT_EDGE_of_outer_rectangle_border +
                      (RIGHT_EDGE_of_outer_rectangle_border - LEFT_EDGE_of_outer_rectangle_border) / 2)
        if len(wrong_diagnostic) > 0:
            pdf.line(
                splitter_x,
                Footer_TOP,
                splitter_x,
                Result_title_AREA_BOTTOM-138-Footer_TOP
            )
        # ------------------------------------------------------
        # Heading for Table
        # ------------------------------------------------------

        pdf.drawCentredString(
            (RIGHT_EDGE_of_outer_rectangle_border - LEFT_EDGE_of_outer_rectangle_border)/2+LEFT_EDGE_of_outer_rectangle_border,
            (divider_y + Result_title_AREA_BOTTOM-138-Footer_TOP)/2+BOTTOM_EDGE+1.75,
            "Wrong Answer Solutions"
        )
        #line under heading of table
        pdf.line(
            LEFT_EDGE_of_outer_rectangle_border,
            Result_title_AREA_BOTTOM - 138,
            RIGHT_EDGE_of_outer_rectangle_border,
            Result_title_AREA_BOTTOM - 138
        )
        if len(wrong_diagnostic) == 0:
            pdf.setFont("Helvetica", font_size)
            pdf.drawCentredString(
                (RIGHT_EDGE_of_outer_rectangle_border - LEFT_EDGE_of_outer_rectangle_border)/2+LEFT_EDGE_of_outer_rectangle_border,
                580,
                "No Wrong Answers"
            )
            pdf.setFont("Helvetica-Bold", font_size)
        # ------------------------------------------------------
        # FOOTER
        # ------------------------------------------------------

        draw_footer(
            pdf,
            doc.page
        )


    # ==========================================================
    # PAGE 2 CANVAS
    # ==========================================================

    def draw_page_2(pdf, doc):

        # ------------------------------------------------------
        # OUTER RECTANGLE
        # ------------------------------------------------------

        pdf.rect(
            LEFT_EDGE_of_outer_rectangle_border,
            BOTTOM_EDGE,
            RIGHT_EDGE_of_outer_rectangle_border - LEFT_EDGE_of_outer_rectangle_border,
            PAGE_HEIGHT - 30
        )

        # ------------------------------------------------------
        # VERTICAL SPLITTER
        # ------------------------------------------------------

        splitter_x = LEFT_EDGE_of_outer_rectangle_border + (
                RIGHT_EDGE_of_outer_rectangle_border - LEFT_EDGE_of_outer_rectangle_border
        ) / 2

        pdf.line(
            splitter_x,
            Footer_TOP,
            splitter_x,
            TOP_EDGE
        )

        # ------------------------------------------------------
        # FOOTER
        # ------------------------------------------------------

        draw_footer(
            pdf,
            doc.page
        )
    if len(wrong_diagnostic) > 0:
        # ==========================================================
        # BUILD DIAGNOSTIC TABLE
        # ==========================================================

        table_data = []

        # ----------------------------------------------------------
        # HEADER
        # ----------------------------------------------------------

        table_data.append([
            Paragraph("Question Number", table_header_style),
            Paragraph("Selected Option", table_header_style),
            Paragraph("Correct Option", table_header_style),
        ])
        # ----------------------------------------------------------
        # ROW ADDER
        # ----------------------------------------------------------
        for question in wrong_diagnostic:
            #unpacker to var
            serial = question["Serial"]
            Selected_Options = question["Selected_options"]
            Correct_Option = question["correct_option"]
            table_data.append([serial, Selected_Options, Correct_Option])
        # ==========================================================
        # TABLE WIDTHS
        # ==========================================================

        half_width = (RIGHT_EDGE_of_outer_rectangle_border - LEFT_EDGE_of_outer_rectangle_border) / 2
        column_width = half_width / 3
        table_widths = [
            column_width,
            column_width,
            column_width,
        ]

        # ==========================================================
        # DIAGNOSTIC TABLE
        # ==========================================================

        diagnostic_table = Table(
            table_data,
            colWidths=table_widths,
            repeatRows=1
        )
        # ==========================================================
        # DIAGNOSTIC TABLE STYLE
        # ==========================================================
        diagnostic_table.setStyle(
            TableStyle([

                # Outer border
                ("BOX", (0, 0), (-1, -1), 1, colors.black),

                # Every cell
                ("GRID", (0, 0), (-1, -1), 0.5, colors.black),

                # Header background
                ("BACKGROUND", (0, 0), (-1, 0), colors.lightgrey),

                # Header font
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),

                # Body font
                ("FONTNAME", (0, 1), (-1, -1), "Helvetica"),

                # Horizontal alignment
                ("ALIGN", (0, 0), (-1, -1), "CENTER"),

                # Vertical alignment
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),

                # Space inside cells
                ("LEFTPADDING", (0, 0), (-1, -1), 5),
                ("RIGHTPADDING", (0, 0), (-1, -1), 5),
                ("TOPPADDING", (0, 0), (-1, -1), 4),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
            ])
        )
    # ==========================================================
    # DOCUMENT + FRAME
    # ==========================================================
    if Student_Name == "":
        output_path = os.path.join(BASE_DIR,"Archive","storage","Result_Cache", str(current_count) + "_" + str(Test_series_name) + "_" + str(Set_Code) + ".pdf")
        path_for_sending = "/Dowload/Result_Cache/"+str(current_count) + "_" + str(Test_series_name) + "_" + str(Set_Code) + ".pdf"
    else:
        output_path = os.path.join(BASE_DIR, "Archive", "storage", "Result_Cache",str(current_count) + "_" + str(Test_series_name) + "_" + str(Student_Name).strip().replace(" ","_") + ".pdf")
        path_for_sending = "/Dowload/Result_Cache/" + str(current_count) + "_" + str(Test_series_name) + "_" + str(Student_Name).strip().replace(" ","_") + ".pdf"
    #cache clearer
    creation_sequence = []
    files_in_cache = os.listdir(os.path.join(BASE_DIR,"Archive","storage","Result_Cache"))
    if len(files_in_cache) >= 5:
        for file in files_in_cache:
            count = int(file.split("_")[0])
            creation_sequence.append(count)
        oldest = min(creation_sequence)
        name_of_file = files_in_cache[creation_sequence.index(oldest)]
        os.remove(os.path.join(BASE_DIR,"Archive","storage","Result_Cache", name_of_file))
    frame1_page_1 = Frame(
        LEFT_EDGE_of_outer_rectangle_border,
        Footer_TOP,
        (RIGHT_EDGE_of_outer_rectangle_border - LEFT_EDGE_of_outer_rectangle_border)/2,
        Result_title_AREA_BOTTOM-138-Footer_TOP,

        leftPadding=0,
        rightPadding=0,
        topPadding=0,
        bottomPadding=0,
        id="result1_page_1",
        showBoundary = 0
    )
    frame2_page_1 = Frame(
        (RIGHT_EDGE_of_outer_rectangle_border-LEFT_EDGE_of_outer_rectangle_border)/2+LEFT_EDGE_of_outer_rectangle_border,
        Footer_TOP,
        (RIGHT_EDGE_of_outer_rectangle_border - LEFT_EDGE_of_outer_rectangle_border) / 2,
        Result_title_AREA_BOTTOM - 138 - Footer_TOP,

        leftPadding=0,
        rightPadding=0,
        topPadding=0,
        bottomPadding=0,
        id="result2_page_1",
        showBoundary=0
    )
    frame1_page_2 = Frame(
        LEFT_EDGE_of_outer_rectangle_border,
        Footer_TOP,
        (RIGHT_EDGE_of_outer_rectangle_border-LEFT_EDGE_of_outer_rectangle_border)/2,
        TOP_EDGE - Footer_TOP,
        leftPadding=0,
        rightPadding=0,
        topPadding=0,
        bottomPadding=0,
        id="result1_page_2",
        showBoundary = 1
    )
    frame2_page_2 = Frame(
        (RIGHT_EDGE_of_outer_rectangle_border-LEFT_EDGE_of_outer_rectangle_border)/2+LEFT_EDGE_of_outer_rectangle_border,
        Footer_TOP,
        (RIGHT_EDGE_of_outer_rectangle_border - LEFT_EDGE_of_outer_rectangle_border) / 2,
        TOP_EDGE - Footer_TOP,
        leftPadding=0,
        rightPadding=0,
        topPadding=0,
        bottomPadding=0,
        id="result1_page_2",
        showBoundary=1
    )
    page_template_1 = PageTemplate(
        id="result_page_1_template",
        frames=[frame1_page_1,frame2_page_1],
        onPage=draw_page_1,
        autoNextPageTemplate="result_page_2_template"
    )

    page_template_2 = PageTemplate(
        id="result_page_2_template",
        frames=[frame1_page_2,frame2_page_2],
        onPage=draw_page_2
    )

    doc = BaseDocTemplate(
        output_path,
        pagesize=A4
    )

    doc.addPageTemplates([
        page_template_1,
        page_template_2
    ])

    # ==========================================================
    # BUILD
    # ==========================================================
    if len(wrong_diagnostic) == 0:
        doc.build([Spacer(1,1)])
    else:
        doc.build([
        diagnostic_table
        ])
    showcase = {"student_name":Student_Name,"achieved_marks":str(Achieved_Marks)+"/"+str(Total_Marks),
                "percentage":percentage,"grade":Grade,"wrong_question":wrong_questions,"unattempted_question":Unattempted_Questions}
    print("PDF CREATED:")
    print(output_path)
    return path_for_sending,showcase
